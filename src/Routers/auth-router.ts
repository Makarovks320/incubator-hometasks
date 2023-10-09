import {Request, Response, Router} from "express";
import {OutputUser, userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../Middlewares/auth-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {authMiddleware, refreshTokenCheck} from "../Middlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {ObjectId} from "mongodb";
import {body, oneOf} from "express-validator";
import {checkEmailExists} from "../Middlewares/check-email-exists";
import {checkLoginExists} from "../Middlewares/check-login-exists";
import {checkConfirmationData} from "../Middlewares/check-confirmation-data";
import {emailValidation} from "../Middlewares/users-validations";
import {STATUSES_HTTP} from "../enums/http-statuses";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: ObjectId
}
const refreshTokenOptions = {httpOnly: true,secure: true}

export const authRouter = Router();
authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (user) {
            const accessToken = await jwtService.createAccessToken(user._id);
            const refreshToken = await jwtService.createRefreshToken(user._id);
            res.status(STATUSES_HTTP.OK_200)
                .cookie('refreshToken', refreshToken, refreshTokenOptions)
                .send({accessToken: accessToken});
        } else {
            res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
        }
    }]);
authRouter.post('/logout', [
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        await jwtService.addTokenToDb(req.userId, req.cookies.refreshToken);
        res.cookie('refreshToken', '', refreshTokenOptions).sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    }
])
authRouter.post('/refresh-token', [
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        // todo: написать методы:
        const accessToken = await jwtService.createAccessToken(req.userId);
        const newRefreshToken = await jwtService.updateRefreshToken(req.userId, req.cookies.refreshToken);
        res.status(STATUSES_HTTP.OK_200)
            .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
            .send({accessToken: accessToken});
    }
])
authRouter.get('/me', [
    authMiddleware,
    async (req: Request, res: Response) => {
        const user: OutputUser | null = await userService.findUserById(req.userId)
        if (!user) {
            res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401)
        } else {
            const userAuthMeOutput: UserAuthMeOutput = {
                email: user.accountData.email,
                login: user.accountData.userName,
                userId: user._id
            }
            res.status(STATUSES_HTTP.OK_200).send(userAuthMeOutput);
        }
    }]);
authRouter.post('/registration', [
    loginAuthValidation,
    emailAuthValidation,
    passwordAuthValidation,
    body('login').custom(checkLoginExists).withMessage('login exists'),
    body('email').custom(checkEmailExists).withMessage('email exists'),
    inputValidator,
    async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
    if (user) {
        res.status(STATUSES_HTTP.NO_CONTENT_204).send();
    } else {
        res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
    }
}
]);
authRouter.post('/registration-confirmation',[
    body('code').custom(checkConfirmationData).withMessage('wrong code or user is already confirmed'),
    inputValidator,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmailByCodeOrEmail(req.body.code)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send();
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
        }
}
]);
authRouter.post('/registration-email-resending',[
    emailValidation,
    body('email').custom(checkConfirmationData).withMessage('wrong email or user is already confirmed'),
    inputValidator,
    async (req: Request, res: Response) => {
        const result = await authService.sendEmailWithNewCode(req.body.email)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send();
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
        }
    }
]);

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
import {authMiddleware} from "../Middlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {ObjectId} from "mongodb";
import {body, oneOf} from "express-validator";
import {checkEmailExists} from "../Middlewares/check-email-exists";
import {checkLoginExists} from "../Middlewares/check-login-exists";
import {checkConfirmationData} from "../Middlewares/check-confirmation-data";
import {emailValidation} from "../Middlewares/users-validations";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: ObjectId
}
export const authRouter = Router();
authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (user) {
            const token = await jwtService.createToken(user);
            res.status(200).send({accessToken: token});
        } else {
            res.sendStatus(401);
        }
    }]);
authRouter.get('/me', [
    authMiddleware,
    async (req: Request, res: Response) => {
        const user: OutputUser | null = await userService.findUserById(req.userId)
        if (!user) {
            res.sendStatus(401)
        } else {
            const userAuthMeOutput: UserAuthMeOutput = {
                email: user.accountData.email,
                login: user.accountData.userName,
                userId: user._id
            }
            res.status(200).send(userAuthMeOutput);
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
        res.status(204).send();
    } else {
        res.status(400).send();
    }
}
]);
authRouter.post('/registration-confirmation',[
    body('code').custom(checkConfirmationData).withMessage('wrong code or user is already confirmed'),
    inputValidator,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmailByCodeOrEmail(req.body.code)
        if (result) {
            res.status(204).send();
        } else {
            res.status(400).send();
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
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    }
]);

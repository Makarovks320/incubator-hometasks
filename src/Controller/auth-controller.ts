import {Request, Response} from "express";
import {OutputUser, userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {ObjectId} from "mongodb";
import {authService} from "../domain/auth-service";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: ObjectId
}
const refreshTokenOptions = {httpOnly: true, secure: true}

export const authController = {
    async loginUser(req: Request, res: Response) {
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
    },

    async logoutUser(req: Request, res: Response) {
        await jwtService.addTokenToDb(req.userId, req.cookies.refreshToken);
        res.cookie('refreshToken', '', refreshTokenOptions).sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    },

    async refreshToken(req: Request, res: Response) {
        const accessToken = await jwtService.createAccessToken(req.userId);
        const newRefreshToken = await jwtService.updateRefreshToken(req.userId, req.cookies.refreshToken);
        res.status(STATUSES_HTTP.OK_200)
            .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
            .send({accessToken: accessToken});
    },

    async getCurrentUserInfo(req: Request, res: Response) {
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
    },

    async registerNewUser(req: Request, res: Response) {
        const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send();
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
        }
    },

    async confirmRegistration(req: Request, res: Response) {
        const result = await authService.confirmEmailByCodeOrEmail(req.body.code)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send();
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
        }
    },

    async resendConfirmationCode(req: Request, res: Response) {
        const result = await authService.sendEmailWithNewCode(req.body.email)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send();
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send();
        }
    }
}

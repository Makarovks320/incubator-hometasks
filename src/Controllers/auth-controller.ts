import {Request, Response} from "express";
import {userService} from "../Services/user-service";
import {jwtService, RefreshTokenInfoType} from "../Application/jwt-service";
import {HTTP_STATUSES} from "../Enums/http-statuses";
import {authService} from "../Services/auth-service";
import {sessionService} from "../Services/session-service";
import {IpType, SessionDbModel} from "../Models/session/session-model";
import {v4 as uuidv4} from "uuid";
import {UserAuthMeViewModel, UserDBModel} from "../Models/user/user-model";

const refreshTokenOptions = {httpOnly: true, secure: true}

export const authController = {
    async loginUser(req: Request, res: Response) {
        const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (user) {
            //подготавливаем данные для сохранения сессии:
            //todo: отработать сценарий, когда рефреш-токен валиден, сделать перезапись сессии вместо создания новой
            const deviceId: string = uuidv4();
            const ip: IpType = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined";
            const deviceName: string = req.headers['user-agent'] || "deviceName undefined";

            // создаем токены
            const accessToken: string = await jwtService.createAccessToken(user._id);
            const refreshToken: string = await jwtService.createRefreshToken(user._id, deviceId);

            // сохраняем текущую сессию:
            await sessionService.addSession(ip, deviceId, deviceName, refreshToken);

            res.status(HTTP_STATUSES.OK_200)
                .cookie('refreshToken', refreshToken, refreshTokenOptions)
                .send({accessToken: accessToken});
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
    },

    async logoutUser(req: Request, res: Response) {
        //здесь надо убить текущую сессию, для этого
        // возьмем deviceId:
        const refreshToken: string = req.cookies.refreshToken;
        const refreshTokenInfo: RefreshTokenInfoType | null = jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const deviceId: string = refreshTokenInfo.deviceId;
        // теперь убьем текущую сессию
        const result = await sessionService.deleteSessionByDeviceId(deviceId);
        if (!result) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.cookie('refreshToken', '', refreshTokenOptions).sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },

    async refreshToken(req: Request, res: Response) {
        // сначала из старого токена вытащим инфу о текущей сессии (понадобится deviceId):
        const currentRefreshToken: string = req.cookies.refreshToken;
        const currentRTInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(currentRefreshToken);
        const deviceId: string = currentRTInfo!.deviceId;

        // теперь создадим новую пару токенов:
        const accessToken: string = await jwtService.createAccessToken(req.userId);
        const newRefreshToken = await jwtService.createRefreshToken(req.userId, deviceId);

        // Также может поменяться ip:
        const currentIp: IpType = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined";

        // Получим информацию о текущей сессии:
        const currentSession: SessionDbModel | null = await sessionService.getSessionForDevice(deviceId);
        if (!currentSession) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }

        const result = await sessionService.updateSession(currentIp, deviceId, newRefreshToken, currentSession);
        if (!result) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }

        res.status(HTTP_STATUSES.OK_200)
            .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
            .send({accessToken: accessToken});
    },

    async getCurrentUserInfo(req: Request, res: Response) {
        const user: UserDBModel | null = await userService.findUserById(req.userId)
        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        } else {
            const userAuthMeOutput: UserAuthMeViewModel = {
                email: user.accountData.email,
                login: user.accountData.userName,
                userId: user._id.toString()
            }
            res.status(HTTP_STATUSES.OK_200).send(userAuthMeOutput);
        }
    },

    async registerNewUser(req: Request, res: Response) {
        const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    },

    async confirmRegistration(req: Request, res: Response) {
        const result = await authService.confirmEmailByCodeOrEmail(req.body.code)
        if (result) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    },

    async resendConfirmationCode(req: Request, res: Response) {
        const result = await authService.sendEmailWithNewCode(req.body.email)
        if (result) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    }
}

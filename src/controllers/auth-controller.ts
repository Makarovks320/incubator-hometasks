import {Request, Response} from "express";
import {UserService} from "../services/user-service";
import {JwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {AuthService} from "../services/auth-service";
import {SessionService} from "../services/session-service";
import {IpType, SessionDbModel} from "../models/session/session-model";
import {v4 as uuidv4} from "uuid";
import {UserDBModel} from "../models/user/user-db-model";
import {UserAuthMeViewModel} from "../models/user/user-auth-me-view-model";

const refreshTokenOptions = {httpOnly: true, secure: true}

export class AuthController {
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected sessionService: SessionService,
        protected jwtService: JwtService
    ){}
    async loginUser(req: Request, res: Response) {
        const user = await this.userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (user) {
            // todo: если есть вылидный рефреш-токен, сделать перезапись сессии вместо создания новой
            // подготавливаем данные для сохранения сессии:
            const deviceId: string = uuidv4();
            const ip: IpType = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined";
            const deviceName: string = req.headers['user-agent'] || "deviceName undefined";

            // создаем токены
            const accessToken: string = await this.jwtService.createAccessToken(user._id);
            const refreshToken: string = await this.jwtService.createRefreshToken(user._id, deviceId);

            // сохраняем текущую сессию:
            await this.sessionService.addSession(ip, deviceId, deviceName, refreshToken);

            res.status(HTTP_STATUSES.OK_200)
                .cookie('refreshToken', refreshToken, refreshTokenOptions)
                .send({accessToken: accessToken});
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
    }

    async logoutUser(req: Request, res: Response) {
        //здесь надо убить текущую сессию, для этого
        // возьмем deviceId:
        const refreshToken: string = req.cookies.refreshToken;
        const refreshTokenInfo: RefreshTokenInfoType | null = this.jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const deviceId: string = refreshTokenInfo.deviceId;
        // теперь убьем текущую сессию
        const result = await this.sessionService.deleteSessionByDeviceId(deviceId);
        if (!result) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.cookie('refreshToken', '', refreshTokenOptions).sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async refreshToken(req: Request, res: Response) {
        // сначала из старого токена вытащим инфу о текущей сессии (понадобится deviceId):
        const currentRefreshToken: string = req.cookies.refreshToken;
        const currentRTInfo: RefreshTokenInfoType | null = await this.jwtService.getRefreshTokenInfo(currentRefreshToken);
        const deviceId: string = currentRTInfo!.deviceId;

        // теперь создадим новую пару токенов:
        const accessToken: string = await this.jwtService.createAccessToken(req.userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(req.userId, deviceId);

        // Также может поменяться ip:
        const currentIp: IpType = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined";

        // Получим информацию о текущей сессии:
        const currentSession: SessionDbModel | null = await this.sessionService.getSessionForDevice(deviceId);
        if (!currentSession) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }

        const result = await this.sessionService.updateSession(currentIp, deviceId, newRefreshToken, currentSession);
        if (!result) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }

        res.status(HTTP_STATUSES.OK_200)
            .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
            .send({accessToken: accessToken});
    }

    async getCurrentUserInfo(req: Request, res: Response) {
        const user: UserDBModel | null = await this.userService.findUserById(req.userId)
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
    }

    async registerNewUser(req: Request, res: Response) {
        const user = await this.authService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    }

    async confirmRegistration(req: Request, res: Response) {
        const result = await this.authService.confirmEmailByCodeOrEmail(req.body.code)
        if (result) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    }

    async resendConfirmationCode(req: Request, res: Response) {
        const result = await this.authService.sendEmailWithNewCode(req.body.email)
        if (result) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send();
        }
    }

    async recoverPassword(req: Request, res: Response) {
        const isPasswordRecovered: boolean = await this.authService.sendEmailWithRecoveryPasswordCode(req.body.email);
        if (isPasswordRecovered) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } else {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send();
        }
    }

    async updatePassword(req: Request, res: Response) {
        const result = await this.authService.updatePassword(req.body.newPassword, req.userId)
        if (result) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send()
        } else {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send()
        }
    }
}

import {Request, Response} from "express";
import {JwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {SessionService} from "../services/session-service";
import {SessionDbModel} from "../models/session/session-model";
import {ObjectId} from "mongodb";
import {getSessionViewModel} from "../helpers/session-view-model-mapper";

export class SecurityDevicesController {
    constructor(
        private sessionService: SessionService,
        private jwtService: JwtService
    ) {}

    async getAllSessionsForUser(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const refreshTokenInfo: RefreshTokenInfoType | null = await this.jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo || !refreshTokenInfo.userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const result: SessionDbModel[] | string = await this.sessionService.getAllSessionsForUser(refreshTokenInfo!.userId);
        if (Array.isArray(result)) {
            const sessions = result.map(s => getSessionViewModel(s));
            res.status(HTTP_STATUSES.OK_200).send(sessions);
            return;
        }
        res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
    }

    async deleteSessionByDeviceId(req: Request, res: Response) {
        const deviceId: string = req.params.deviceId;
        // проверим, есть ли такой девайс в сессиях
        const sessionForDevice: SessionDbModel | null = await this.sessionService.getSessionForDevice(deviceId);
        if (!sessionForDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        // достанем рефреш-токен:
        const refreshToken: string = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const refreshTokenInfo: RefreshTokenInfoType | null = this.jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        // проверим, что deviceId соответствует данному юзеру:
        // 1) сначала найдем все сессии этого юзера
        const sessions: SessionDbModel[] | string = await this.sessionService.getAllSessionsForUser(req.userId);
        if (typeof sessions === 'string') {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        // 2) проверка на наличие девайса
        const sessionForDeleting = sessions.find(s => s.deviceId === deviceId);
        if (!sessionForDeleting) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        // удалим сессию по deviceId:
        await this.sessionService.deleteSessionByDeviceId(deviceId);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async deleteAllSessionsForUserExcludeCurrent(req: Request, res: Response) {
        /*Удаляет все сессии кроме текущей*/
        // определим текущую сессию по девайсу:
        const refreshToken: string = req.cookies.refreshToken;
        const refreshTokenInfo: RefreshTokenInfoType | null = this.jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const currentDeviceId: string = refreshTokenInfo.deviceId;
        const currentUserId: ObjectId = refreshTokenInfo.userId;
        // дернем в сервисе метод для удаления всех сессий юзера кроме сессии для текущего девайса
        try {
            await this.sessionService.deleteAllSessionsExcludeCurrent(currentUserId, currentDeviceId);
        } catch (e) {
            console.log(e);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
}

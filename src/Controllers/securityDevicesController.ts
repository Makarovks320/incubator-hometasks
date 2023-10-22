import {Request, Response} from "express";
import {jwtService, RefreshTokenInfoType} from "../Application/jwt-service";
import {HTTP_STATUSES} from "../Enums/http-statuses";
import {sessionService} from "../Services/session-service";
import {SessionDbModel, SessionViewModel} from "../Models/session/session-model";
import {ObjectId} from "mongodb";

export const securityDevicesController = {
    async getAllSessionsForUser(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        const refreshTokenInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo || !refreshTokenInfo.userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        const sessions: SessionViewModel[] | null = await sessionService.getAllSessionsForUser(refreshTokenInfo!.userId);
        res.status(HTTP_STATUSES.OK_200).send(sessions);
    },

    async deleteSessionByDeviceId(req: Request, res: Response) {
        const deviceId: string = req.params.deviceId;
        // проверим, есть ли такой девайс в сессиях
        const sessionForDevice: SessionDbModel | null = await sessionService.getSessionForDevice(deviceId);
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

        const refreshTokenInfo: RefreshTokenInfoType | null = jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        // проверим, что deviceId соответствует данному юзеру:
        // 1) сначала найдем все сессии этого юзера
        const sessions: SessionViewModel[] | null = await sessionService.getAllSessionsForUser(req.userId);
        if (!sessions) {
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
        await sessionService.deleteSessionByDeviceId(deviceId);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}

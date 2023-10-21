import {Request, Response} from "express";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {sessionService} from "../domain/session-service";
import {SessionViewModel} from "../models/session/session-model";
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
        const deviceId = req.params.deviceId;

        // достанем рефреш-токен:
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const refreshTokenInfo: RefreshTokenInfoType | null = jwtService.getRefreshTokenInfo(refreshToken);
        //todo почему без этого не работает подсказка TS для refreshTokenInfo?
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const userId: ObjectId = refreshTokenInfo.userId;

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
        const result = sessionService.deleteSessionByDeviceId(deviceId);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}

import {Request, Response} from "express";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {sessionService} from "../domain/session-service";

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
        const sessions = await sessionService.getAllSessionsForUser(refreshTokenInfo!.userId);
        res.status(HTTP_STATUSES.OK_200).send(sessions);
    },

    async deleteSessionByDeviceId(req: Request, res: Response) {
        // should return error if :id from uri param not found; status 404;
        const deviceId = req.params.deviceId;

    },

    async deleteAllSessions(req: Request, res: Response) {
        const result: boolean = await sessionService.deleteAllSessions();
        result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            : res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
    }
}

import {Request, Response} from "express";
import {sessionsRepository} from "../Repositories/sessions-repository";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {sessionService} from "../domain/session-service";

export const securityDevicesController = {
    async getAllSessionsForUser(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
        const refreshTokenInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(refreshToken);
        if (refreshTokenInfo.userId) res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
        const sessions = await sessionService.getAllSessionsForUser(refreshTokenInfo.userId);
        res.status(STATUSES_HTTP.OK_200).send(sessions);
    }
}

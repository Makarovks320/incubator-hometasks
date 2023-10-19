import {Request, Response} from "express";
import {sessionsRepository} from "../Repositories/sessions-repository";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {sessionService} from "../domain/session-service";

export const securityDevicesController = {
    async getAllSessionsForUser(req: Request, res: Response) {
        if (!req.headers.authorization) {
            res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        const userId: string | null = await jwtService.getUserIdByToken(token);
        if (!userId) {
            res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
            return;
        }
        const sessions = await sessionService.getAllSessionsForUser(userId);
        res.send(sessions);
    }
}

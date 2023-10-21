import {NextFunction, Request, Response} from "express";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {userService} from "../domain/user-service";
import mongoose from "mongoose";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {ObjectId} from "mongodb";

/* миддлвар проверяет заголовок authorization
достает bearer token
дергает getUserIdByToken из jwtService
если юзера нет, то 401
если юзер есть, то добавляет юзера в реквест в поле user */

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
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
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await userService.findUserById(userObjectId);
    if (user) {
        req.userId = userObjectId;
        next();
        return;
    }
    res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
}

export async function refreshTokenCheck(req: Request, res: Response, next: NextFunction) {
    if(!req.cookies.refreshToken) {
        res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
        return;
    }
    const token = req.cookies.refreshToken;

    const refreshTokenInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(token);
    if (!refreshTokenInfo) {
        res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500);
        return;
    }
    // проверяем, не истек ли срок годности токена
    if (refreshTokenInfo.exp < +(new Date())) {
        res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
        return;
    }

    const userId: ObjectId = refreshTokenInfo.userId;
    // const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await userService.findUserById(userId);
    if (user) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
}

import {NextFunction, Request, Response} from "express";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";
import {userService} from "../composition-root";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {ObjectId} from "mongodb";

/* миддлвар проверяет заголовок authorization
достает bearer token
дергает getUserIdByToken из jwtService
если юзера нет, то 401
если юзер есть, то добавляет юзер id в реквест в поле userId */

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId: ObjectId | null = await jwtService.getUserIdByToken(token);
    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const user = await userService.findUserById(userId);
    if (user) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
}

/* миддлвар проверяет refresh-token из cookies
достает юзер id
если юзера нет, то 401
если юзер есть, то добавляет юзер id в реквест в поле userId */
export async function refreshTokenCheck(req: Request, res: Response, next: NextFunction) {
    if(!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const token = req.cookies.refreshToken;

    const refreshTokenInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(token);
    if (!refreshTokenInfo) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    const userId: ObjectId = refreshTokenInfo.userId;

    const user = await userService.findUserById(userId);
    if (user) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
}


import {NextFunction, Request, Response} from "express";
import {JwtService, RefreshTokenInfoType} from "../../application/jwt-service";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import {ObjectId} from "mongodb";
import {UserService} from "../../services/user-service";


export class AuthMiddleware {
    constructor(
        protected userService: UserService,
        protected jwtService: JwtService
    ) {
    }

    /* проверяет заголовок authorization,
    достает bearer token,
    дергает getUserIdByToken из jwtService.
    если юзера нет, то 401
    если юзер есть, то добавляет юзер id в реквест в поле userId */
    async checkBearerToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        const userId: ObjectId | null = await this.jwtService.getUserIdByToken(token);
        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const user = await this.userService.findUserById(userId);
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
    async refreshTokenCheck(req: Request, res: Response, next: NextFunction) {
        if (!req.cookies.refreshToken) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const token = req.cookies.refreshToken;

        const refreshTokenInfo: RefreshTokenInfoType | null = await this.jwtService.getRefreshTokenInfo(token);
        if (!refreshTokenInfo) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const userId: ObjectId = refreshTokenInfo.userId;

        const user = await this.userService.findUserById(userId);
        if (user) {
            req.userId = userId;
            next();
            return;
        }
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}


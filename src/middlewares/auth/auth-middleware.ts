import {NextFunction, Request, Response} from "express";
import {JwtService, RefreshTokenInfoType} from "../../application/jwt-service";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import {ObjectId} from "mongodb";
import {UserService} from "../../services/user-service";
import {UserDBModel} from "../../models/user/user-db-model";
import jwt from "jsonwebtoken";
import {UsersQueryRepository} from "../../repositories/query-repositories/users-query-repository";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../../repositories/users-repository";
import {CustomValidator} from "express-validator";

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(JwtService) private jwtService: JwtService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository
    ) {
    }
    checkBasicAuthorization (req: Request, res: Response, next: NextFunction) {
        // закодируем верные логин и пароль для дальнейшей проверки
        const coded = Buffer.from('admin:qwerty').toString('base64');
        req.headers.authorization === `Basic ${coded}` ? next() :
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
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

    /* проверяет заголовок authorization,
    достает bearer token,
    дергает getUserIdByToken из jwtService.
    если юзера нет, то 401
    если юзер есть, то добавляет юзер id в реквест в поле userId */
    async lookBearerTokenForCurrentUserId(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            next();
            return;//todo: нужны ли ретурны?
        }
        const token = req.headers.authorization.split(' ')[1];
        const userId: ObjectId | null = await this.jwtService.getUserIdByToken(token);
        if (!userId) {
            next();
            return;
        }
        const user = await this.userService.findUserById(userId);
        if (user) {
            req.userId = userId;
            next();
            return;
        }
    }

    /* миддлвар проверяет refresh-token из cookies
    достает юзер id
    если юзера нет, то 401
    если юзер есть, то добавляет юзер id в реквест в поле userId */
    async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
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

    // @ts-ignore
    async isRecoveryCodeCorrect (value: string, {req}): Promise<boolean> {
        const user: UserDBModel | null = await this.usersQueryRepository.findUserByPassRecoveryCode(value);

        if (!user) throw new Error('Confirmation code is incorrect');

        if (user.passwordRecovery.active) {
            throw new Error('Confirmation code has been activated');
        }

        // Check that the token is not expired
        try {
            await jwt.verify(value, process.env.JWT_SECRET!)
        } catch (e) {
            throw new Error('Token is expired');
        }

        req.userId = user._id;
        return true;
    };

    checkConfirmationData: CustomValidator = async (value, { req}) => {
        if (!value) return true;
        const user = await this.usersRepository.findUserByConfirmationCodeOrEmail(value);
        if (!user) {
            throw new Error('code or email doesnt exist');
        }
        if (user.emailConfirmation.isConfirmed) {
            throw new Error('user is already confirmed');
        }
        return true;
    }
    checkEmailExists: CustomValidator = async (value, { req}) => {
        const user = await this.usersRepository.findUserByLoginOrEmail(value);
        if (user) {
            throw new Error('Incorrect user email: email already exists');
        }
        return true;
    }

    checkLoginExists: CustomValidator = async (value, { req}) => {
        const user = await this.usersRepository.findUserByLoginOrEmail(value);
        if (user) {
            throw new Error('Incorrect user login: login already exists');
        }
        return true;
    }
}


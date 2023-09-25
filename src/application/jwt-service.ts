import {UserAccountDBType} from "../Repositories/users-repository";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {expiredTokensRepository} from "../Repositories/expired-tokens-repository";

const secret: string = settings.JWT_SECRET;
const refreshSecret: string = settings.JWT_REFRESH_SECRET;
if (!secret) {
    throw new Error('jwt secret is not passed');
}
if (!refreshSecret) {
    throw new Error('jwt secret is not passed');
}

export const jwtService = {
    async createAccessToken(userId: ObjectId) {
        return jwt.sign({userId}, secret, {expiresIn: 10});
    },
    async createRefreshToken(userId: ObjectId) {
        return jwt.sign({userId}, refreshSecret, {expiresIn: 20});
    },
    async updateRefreshToken(userId: ObjectId, refreshToken: string) {
        await expiredTokensRepository.addTokenToDb(refreshToken, userId);
        return jwt.sign({userId}, refreshSecret, {expiresIn: 20});
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            // делаем в цикле try-catch, т.к. verify() может вернуть ошибку
            const result: any = await jwt.verify(token, secret);
            // todo: почему verify возвращает строку? хотя получал ObjectId
            return result.userId
        } catch (e) {
            return null;
        }
    },
    async addTokenToDb(userId: ObjectId, refreshToken: string) {
        await expiredTokensRepository.addTokenToDb(refreshToken, userId);
        return;
    }
}

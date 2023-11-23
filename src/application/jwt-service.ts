import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {injectable} from "inversify";

const secret: string = settings.JWT_SECRET;
const refreshSecret: string = settings.JWT_REFRESH_SECRET;
if (!secret) {
    throw new Error('jwt secret is not passed');
}
if (!refreshSecret) {
    throw new Error('jwt secret is not passed');
}

export type RefreshTokenInfoType = {
    deviceId: string,
    userId: ObjectId,
    iat: number,
    exp: number
}

@injectable()
export class JwtService {
    async createAccessToken(userId: ObjectId) {
        return jwt.sign({userId}, secret, {expiresIn: '600s'});
    }

    async createRefreshToken(userId: ObjectId, deviceId: string) {
        return jwt.sign({userId, deviceId}, refreshSecret, {expiresIn: '1200s'})
    }

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = await jwt.verify(token, secret);
            // todo: обсудить, почему создаем userId как ObjectId, а возвращается string.
            // todo: почему verify возвращает result.userId как строку? хотя получал ObjectId
            const userId = stringToObjectIdMapper(result.userId);
            return userId;
        } catch (e) {
            return null;
        }
    }

    getRefreshTokenInfo(refreshToken: string): RefreshTokenInfoType | null {
        try {
            const result: any = jwt.verify(refreshToken, secret)
            return {
                deviceId: result.deviceId,
                iat: result.iat * 1000,
                exp: result.exp * 1000,
                userId: stringToObjectIdMapper(result.userId)
            }
        } catch (e) {
            return null
        }
    }
}

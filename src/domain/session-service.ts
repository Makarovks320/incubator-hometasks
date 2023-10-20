import {IpType, SessionDbType} from "../models/session/session-model";
import {sessionsRepository} from "../Repositories/sessions-repository";
import {ObjectId} from "mongodb";
import {jwtService, RefreshTokenInfoType} from "../application/jwt-service";

export const sessionService = {
    async addSession (ip: IpType, deviceId: string, deviceName: string, refreshToken: string): Promise<SessionDbType | null> {
        // достанем нужную для сессии инфу из Рефреш-токена:
        const refreshTokenInfo: RefreshTokenInfoType | null = await jwtService.getRefreshTokenInfo(refreshToken);
        if (!refreshTokenInfo) return null;
        const refreshTokenIssuedAt: Date = new Date(refreshTokenInfo.iat);
        const refreshTokenExpiresAt: Date = new Date(refreshTokenInfo.exp);
        const userId: ObjectId = refreshTokenInfo.userId

        // сохраним сессию:
        const session: SessionDbType = {
            _id: new ObjectId(),
            ip,
            title: 'title mock',
            deviceId,
            deviceName,
            refreshTokenIssuedAt,
            refreshTokenExpiresAt,
            userId
        }
        await sessionsRepository.addSession(session);
        return session;
    },
    async getAllSessionsForUser(userId: ObjectId): Promise<SessionDbType[] | null>  {
        return await sessionsRepository.getAllSessionsForUser(userId);
    }
}

import {SessionDbModel, SessionViewModel} from "../Models/session/session-model";

export const getSessionViewModel = (session: SessionDbModel): SessionViewModel => {
    return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.refreshTokenIssuedAt.toISOString(),
        deviceId: session.deviceId
    }
}

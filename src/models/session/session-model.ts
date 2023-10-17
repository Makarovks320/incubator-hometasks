import {ObjectId} from "mongodb";

export type SessionDbType = {
    id: ObjectId,
    ip: string,
    title: string,
    deviceId: string,
    deviceName: string,
    refreshTokenIssuedAt: Date,//todo: можно ли использовать в качестве даты последней активности?
    refreshTokenExpiresAt: Date,
    userId: ObjectId
}

export type SessionViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

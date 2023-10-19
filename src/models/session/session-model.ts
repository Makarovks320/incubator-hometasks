import {ObjectId} from "mongodb";

export type IpType = string | string[];
export type SessionDbType = {
    _id: ObjectId,
    ip: IpType,
    title: string,
    deviceId: string,
    deviceName: string,
    refreshTokenIssuedAt: Date,//todo: можно ли использовать в качестве даты последней активности?
    refreshTokenExpiresAt: Date,
    userId: ObjectId
}

export type SessionViewModel = {
    ip: IpType,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

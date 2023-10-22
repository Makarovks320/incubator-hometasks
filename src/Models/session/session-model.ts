import {ObjectId} from "mongodb";

export type IpType = string | string[];
export type SessionDbModel = {
    _id: ObjectId,
    ip: IpType,
    title: string,
    deviceId: string,
    deviceName: string,
    refreshTokenIssuedAt: Date,
    refreshTokenExpiresAt: Date,
    userId: ObjectId
}

export type SessionViewModel = {
    ip: IpType,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

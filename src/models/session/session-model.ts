import {ObjectId} from "mongodb";
import mongoose from "mongoose";

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

export const sessionMongoSchema = new mongoose.Schema<SessionDbModel>({
    ip: {type: String || [String], required: true},
    title: {type: String, required: true},
    deviceId: {type: String, required: true},
    deviceName: {type: String, required: true},
    refreshTokenIssuedAt: {type: Date, required: true},
    refreshTokenExpiresAt: {type: Date, required: true}
})
export const SessionModel = mongoose.model('sessions', sessionMongoSchema);

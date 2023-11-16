import {SessionDbModel, SessionModel} from "../models/session/session-model";
import {ObjectId} from "mongodb";
import {MongooseError} from "mongoose";

export class SessionsRepository {
    async addSession(session: SessionDbModel): Promise<SessionDbModel | null> {
        try {
            await SessionModel.insertMany(session);
        } catch (e) {
            console.log(e);
            return null;
        }
        return session;
    }
    async getAllSessionsForUser(userId: ObjectId): Promise<SessionDbModel[] | string> {
        try {
        const sessions = await SessionModel.find({userId}).lean();
        return sessions;
        } catch (e) {
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error'
        }
    }
    async getSessionForDevice(deviceId: string): Promise<SessionDbModel | null> {
        const session: SessionDbModel | null = await SessionModel.findOne({deviceId});
        return session;
    }
    async updateSession(deviceId: string, session: SessionDbModel): Promise<boolean> {
        const result = await SessionModel.updateOne({deviceId}, session);
        return result.matchedCount === 1;
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({deviceId});
        return result.deletedCount === 1;
    }
    async deleteAllSessions(): Promise<boolean> {
        try {
            await SessionModel.deleteMany();
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async deleteAllSessionsExcludeCurrent(currentUserId: ObjectId, currentDeviceId: string) {
        // удалим все сессии для текущего юзера, кроме сессии с текущим deviceId
        const result = await SessionModel.deleteMany({
            $and: [
                {userId: currentUserId},
                {deviceId: {$not: {$eq: currentDeviceId}}}
            ]
        });
    }
}

import {sessionsCollection, userCollection} from "./db";
import {SessionDbModel, SessionViewModel} from "../Models/session/session-model";
import {ObjectId} from "mongodb";
import {getSessionViewModel} from "../Helpers/session-view-model-mapper";

export const sessionsRepository = {
    async addSession(session: SessionDbModel): Promise<SessionDbModel | null> {
        try {
            await sessionsCollection.insertOne(session);
        } catch (e) {
            console.log(e);
            return null;
        }
        return session;
    },
    async getAllSessionsForUser(userId: ObjectId): Promise<SessionViewModel[] | null> {
        const sessions = await sessionsCollection.find({userId: userId})
            .map(s => getSessionViewModel(s))
            .toArray();
        return sessions;
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({deviceId});
        return result.deletedCount === 1;
    },
    async deleteAllSessions(): Promise<boolean> {
        try {
            await sessionsCollection.deleteMany();
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    },
    async getSessionForDevice(deviceId: string): Promise<SessionDbModel | null> {
        const session: SessionDbModel | null = await sessionsCollection.findOne({deviceId});
        return session;
    }
}

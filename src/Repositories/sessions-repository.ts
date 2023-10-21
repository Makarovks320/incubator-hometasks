import {sessionsCollection} from "./db";
import {SessionDbModel, SessionViewModel} from "../models/session/session-model";
import {ObjectId} from "mongodb";
import {getSessionViewModel} from "../helpers/session-view-model-mapper";

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
    async deleteAllSessions(): Promise<boolean> {
        try {
            await sessionsCollection.deleteMany();
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
}

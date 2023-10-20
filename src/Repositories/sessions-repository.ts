import {sessionsCollection} from "./db";
import {SessionDbType} from "../models/session/session-model";
import {ObjectId} from "mongodb";

export const sessionsRepository = {
    async addSession(session: SessionDbType): Promise<SessionDbType | null> {
        try {
            await sessionsCollection.insertOne(session);
        } catch (e) {
            console.log(e);
            return null;
        }
        return session;
    },
    async getAllSessionsForUser(userId: ObjectId): Promise<SessionDbType[] | null> {
        const result = await sessionsCollection.find({userId: userId}).toArray();
        return result;
    }
}

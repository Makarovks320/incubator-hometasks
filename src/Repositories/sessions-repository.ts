import {sessionsCollection} from "./db";
import {SessionDbType} from "../models/session/session-model";
import mongoose from "mongoose";

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
    async getAllSessionsForUser(userId: string): Promise<SessionDbType[] | null> {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const result = await sessionsCollection.find({userId: userObjectId}).toArray();
        return result;
    }
}

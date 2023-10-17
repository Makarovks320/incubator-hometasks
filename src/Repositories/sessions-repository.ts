import {sessionsCollection} from "./db";
import {SessionDbType} from "../models/session/session-model";

export const sessionsRepository = {
    async addSession(session: SessionDbType): Promise<SessionDbType | null> {
        try {
            await sessionsCollection.insertOne(session);
        } catch (e) {
            console.log(e);
            return null;
        }
        return session;
    }
}

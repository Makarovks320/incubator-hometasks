import {expiredTokensCollection} from "./db";
import {ObjectId} from "mongodb";


export type ExpiredTokenType = {
    userId: ObjectId,
    refreshToken: string
}

export const expiredTokensRepository = {
    async addTokenToDb(token: string, userId: ObjectId): Promise<void> {
        const expiredToken: ExpiredTokenType = {
            userId,
            refreshToken: token
        }
        await expiredTokensCollection.insertOne(expiredToken);
        return;
    },
    async findToken(token: string): Promise<ExpiredTokenType | null> {
      return await expiredTokensCollection.findOne({refreshToken: token});
    }
}

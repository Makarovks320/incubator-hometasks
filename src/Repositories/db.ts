import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {Post} from "./posts-repository";
import {Blog} from "./blogs-repository";
import {UserAccountDBType} from "./users-repository";
import {Comment} from "./comments-repository";
import {ExpiredTokenType} from "./expired-tokens-repository";
import {SessionDbType} from "../models/session/session-model";
import {rateLimitDBModel} from "../models/rate-limiting/rate-limiting-model";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) {
    throw new Error('db uri is not passed');
}
const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

// создание клиента кластера монго
export const client = new MongoClient(mongoUri);

export const db = client.db(DbName);
export const blogCollection = db.collection<Blog>('blogs');
export const postCollection = db.collection<Post>('posts');
export const userCollection = db.collection<UserAccountDBType>('users');
export const commentCollection = db.collection<Comment>('comments');
export const expiredTokensCollection = db.collection<ExpiredTokenType>('expiredTokens');
export const sessionsCollection = db.collection<SessionDbType>('sessions');
export const rateLimitingCollection = db.collection<rateLimitDBModel>("rateLimit");

export const DEFAULT_PROJECTION = { _id: false };
// создадим асинхронную функцию подключения клиента
export async function runDb() {
    try {
        await client.connect();
        // Establish and verify connection
        db.command({ping: 1});
        console.log('Successfully connected to db');
    } catch {
        console.log("couldn't connect to db");
        await client.close();
    }
}




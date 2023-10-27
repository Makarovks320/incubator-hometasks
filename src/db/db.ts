import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {Post} from "../repositories/posts-repository";
import {Blog} from "../repositories/blogs-repository";
import {Comment} from "../repositories/comments-repository";
import {SessionDbModel} from "../models/session/session-model";
import {rateLimitDBModel} from "../models/rate-limiting/rate-limiting-model";
import {UserDBModel} from "../models/user/user-model";

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
export const userCollection = db.collection<UserDBModel>('users');
export const commentCollection = db.collection<Comment>('comments');
export const sessionsCollection = db.collection<SessionDbModel>('sessions');
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




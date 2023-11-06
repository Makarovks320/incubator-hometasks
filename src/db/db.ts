import mongoose from 'mongoose'
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {SessionDbModel} from "../models/session/session-model";
import {rateLimitDBModel} from "../models/rate-limiting/rate-limiting-model";
import {UserDBModel, userMongoSchema} from "../models/user/user-db-model";
import {PostViewModel} from "../models/post/post-view-model";
import {blogMongoSchema} from "../models/blog/blog-db-model";
import {CommentDBModel, commentMongoSchema} from "../models/comment/comment-db-model";
import {postMongoSchema} from "../models/post/post-db-model";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) {
    throw new Error('db uri is not passed');
}
const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

// создание клиента кластера монго
export const client = new MongoClient(mongoUri);

export const db = client.db(DbName);
export const PostModel = mongoose.model('posts', postMongoSchema);
export const UserModel = mongoose.model('users', userMongoSchema);
export const CommentModel = mongoose.model('comments', commentMongoSchema);
export const sessionsCollection = db.collection<SessionDbModel>('sessions');
export const rateLimitingCollection = db.collection<rateLimitDBModel>("rateLimit");
export const BlogModel = mongoose.model('blogs', blogMongoSchema);

export const DEFAULT_PROJECTION = { _id: false };
export const DEFAULT_MONGOOSE_PROJECTION = { _id: 0, __v: 0 };
export const WITHOUT_v_MONGOOSE_PROJECTION = { __v: 0 };

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
export async function stopDb() {
        await client.close();
        console.log("Successfully disconnected");
}
export async function runMongooseClient() {
    try {
        await mongoose.connect(`${mongoUri}/${DbName}`);
        console.log('mongoose connected');
    } catch {
        await mongoose.disconnect();
        console.log("couldn't connect mongoose client to db");
    }
}
export async function stopMongooseClient() {
        await mongoose.disconnect();
        console.log("mongoose disconnected");
}



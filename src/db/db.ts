import mongoose from 'mongoose';
import dotenv from "dotenv";
import {sessionMongoSchema} from "../models/session/session-model";
import {rateLimitMongoSchema} from "../models/rate-limiting/rate-limiting-model";
import {userMongoSchema} from "../models/user/user-db-model";
import {blogMongoSchema} from "../models/blog/blog-db-model";
import {commentMongoSchema} from "../models/comment/comment-db-model";
import {postMongoSchema} from "../models/post/post-db-model";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) {
    throw new Error('db uri is not passed');
}
const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

export const PostModel = mongoose.model('posts', postMongoSchema);
export const UserModel = mongoose.model('users', userMongoSchema);
export const CommentModel = mongoose.model('comments', commentMongoSchema);
export const SessionModel = mongoose.model('sessions', sessionMongoSchema);
export const RateLimitModel = mongoose.model('rateLimit', rateLimitMongoSchema);
export const BlogModel = mongoose.model('blogs', blogMongoSchema);

export const DEFAULT_PROJECTION = { _id: false };
export const DEFAULT_MONGOOSE_PROJECTION = { _id: 0, __v: 0 };
export const WITHOUT_v_MONGOOSE_PROJECTION = { __v: 0 };

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



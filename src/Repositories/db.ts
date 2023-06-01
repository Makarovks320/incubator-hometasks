import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {Post} from "./postsRepository";
import {Blog} from "./blogsRepository";
import {User} from "./usersRepository";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) {
    throw new Error('db uri is not passed');
}

// создание клиента кластера монго
export const client = new MongoClient(mongoUri);

export const db = client.db('ht_05');
export const blogCollection = db.collection<Blog>('blogs');
export const postCollection = db.collection<Post>('posts');
export const userCollection = db.collection<User>('users');

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




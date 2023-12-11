import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const mongoUri: string | undefined = process.env.MONGO_LOCAL_URL;
// const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) {
    throw new Error('db uri is not passed');
}
const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

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



import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const mongoUri = process.env.MONGO_CLOUD_URL;
if (!mongoUri) {
    throw new Error('db uri is not passed');
}

// создание клиента кластера монго
const client = new MongoClient(mongoUri);
// создадим асинхронную функцию подключения клиента
export async function runDb() {
    try {
        await client.connect();
    } catch {
      console.log("couldn't connect to db");
      await client.close();
    }
}




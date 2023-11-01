import dotenv from "dotenv";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) throw new Error('db uri is not passed');

const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

export const connection_string = mongoUri + '/' + DbName

export const authBasicHeader = {Authorization: 'Basic YWRtaW46cXdlcnR5'}

export function generateString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

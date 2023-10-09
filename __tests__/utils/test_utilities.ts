import dotenv from "dotenv";

dotenv.config();

const mongoUri: string = process.env.MONGO_CLOUD_URL || '';
if (!mongoUri) throw new Error('db uri is not passed');

const DbName =  process.env.MONGO_DB_NAME || "incubator-project";

export const connection_string = mongoUri + '/' + DbName

export const authBasicHeader = {Authorization: 'Basic YWRtaW46cXdlcnR5'}

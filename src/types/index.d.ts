import {ObjectId} from "mongodb";

declare global {
    namespace Express {
        export interface Request {
                userId: ObjectId,
                blogName: string | null
        }
    }
}

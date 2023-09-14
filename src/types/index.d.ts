// todo: почему ошибка?
import {ObjectId} from "mongodb";
import {Request} from "express";

declare global {
    namespace Express {
        export interface Request {
                userId: ObjectId,
                blogName: string | null
        }
    }
}

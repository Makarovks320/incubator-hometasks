// todo: почему ошибка?
import {Request} from "express";

declare global {
    namespace Express {
        export interface Request {
                userId: string | null,
                blogName: string | null
        }
    }
}

// todo: почему ошибка?
import {Request} from "express";

declare global {
    namespace Express {
        export interface Request {
            context: {
                userId: string | null,
                blogName: string | null
            }
        }
    }
}

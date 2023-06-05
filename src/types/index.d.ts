// todo: почему ошибка?
import {Request} from "express";

declare global {
    namespace Exress {
        export interface Request {
            userId: string | null,
        }
    }
}

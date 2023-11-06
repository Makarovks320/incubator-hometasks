import {NextFunction, Request, Response} from "express";
import {RateLimitModel} from "../db/db";
import {rateLimitDBModel, rateLimitViewModel} from "../models/rate-limiting/rate-limiting-model";
import {ObjectId} from "mongodb";
import subSeconds from "date-fns/subSeconds";
import mongoose from "mongoose";

/*
Middlewar возвращает ошибку 429 "too many requests"
*/

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //занесем в БД текущую активность:
    const newAPIUsage: rateLimitDBModel = {
        _id: new ObjectId(),
        IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "undefined",
        URL: req.baseUrl + req.url || req.originalUrl,
        date: new Date
    }
    await RateLimitModel.insertMany(newAPIUsage);

    //Проверим, превышается ли количество запросов:
    const filter: mongoose.FilterQuery<rateLimitViewModel> = {IP: newAPIUsage.IP, URL: newAPIUsage.URL, date: {$gt: subSeconds(new Date(), 10) }};
    const useagesCount = await RateLimitModel.countDocuments(filter);
    if (useagesCount > 5) {
        res.status(429).send({errorsMessages: [{message: "Too many requests"}]});
        return;
    }
    next();
}

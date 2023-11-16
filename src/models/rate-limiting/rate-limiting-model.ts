import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export type rateLimitDBModel = {
    _id: ObjectId
    IP: string | string[]
    URL: string
    date: Date
}

export type rateLimitViewModel = {
    IP: string | string[]
    URL: string
    date: Date
}

const rateLimitMongoSchema = new mongoose.Schema<rateLimitDBModel>({
    _id: {type: ObjectId, required: true},
    IP: {type: String || [String], required: true},
    URL: {type: String, required: true},
    date: {type: Date, required: true},
})
export const RateLimitModel = mongoose.model('rateLimit', rateLimitMongoSchema);

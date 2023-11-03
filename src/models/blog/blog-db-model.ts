import mongoose from "mongoose";

export type BlogDBModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}

export const blogMongoSchema = new mongoose.Schema<BlogDBModel>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    isMembership: { type: Boolean, require: true },
    createdAt: { type: String, require: true }
})

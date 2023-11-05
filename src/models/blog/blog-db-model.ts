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
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    createdAt: { type: String, required: true }
})

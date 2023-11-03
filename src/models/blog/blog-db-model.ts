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
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    isMembership: Boolean,
    createdAt: String
})

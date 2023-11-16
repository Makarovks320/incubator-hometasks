import mongoose from "mongoose";

export class BlogDBModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public isMembership: boolean,
        public createdAt: string
    ) {
    }
}

export const blogMongoSchema = new mongoose.Schema<BlogDBModel>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    createdAt: { type: String, required: true }
})
export const BlogModel = mongoose.model('blogs', blogMongoSchema);

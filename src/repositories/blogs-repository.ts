import {BlogModel, DEFAULT_MONGOOSE_PROJECTION, DEFAULT_PROJECTION} from "../db/db";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {MongooseError} from "mongoose";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return BlogModel.findOne({id}).select(DEFAULT_MONGOOSE_PROJECTION).lean();
    },
    async createNewBlog(b: BlogViewModel): Promise<BlogViewModel | string> {
        try {
            await BlogModel.insertMany(b);
            return b;
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
    },
    async updateBlogById(id: string, blog: BlogViewModel): Promise<boolean> {
        const result = await BlogModel.updateOne({id}, blog);
        return result.matchedCount === 1;
    },
    async deleteAllBlogs(): Promise<void> {
        await BlogModel.deleteMany({});
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({id});
        return result.deletedCount === 1
    }
};

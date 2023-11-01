import {blogCollection, DEFAULT_PROJECTION} from "../db/db";
import {BlogViewModel} from "../models/blog/blog-view-model";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogCollection.findOne({id},{ projection: DEFAULT_PROJECTION});
    },
    async createNewBlog(b: BlogViewModel): Promise<BlogViewModel> {
        try {
            await blogCollection.insertOne({...b});
        } catch (e) {
            console.log(e);
        }
        // todo: а если ошибка из БД?
        //  if (e instanceof MongoAPIError.message) {return e.message}
        return b;
    },
    async updateBlogById(id: string, b: BlogViewModel): Promise<boolean> {
        const result = await blogCollection.updateOne({id}, {"$set": {...b}});
        return result.matchedCount === 1;
    },
    async deleteAllBlogs(): Promise<void> {
        await blogCollection.deleteMany({});
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({id});
        return result.deletedCount === 1
    }
};

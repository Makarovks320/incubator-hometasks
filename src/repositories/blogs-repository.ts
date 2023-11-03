import {BlogModel, DEFAULT_PROJECTION} from "../db/db";
import {BlogViewModel} from "../models/blog/blog-view-model";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return BlogModel.findOne({id},{ projection: DEFAULT_PROJECTION}).lean();
    },
    async createNewBlog(b: BlogViewModel): Promise<BlogViewModel> {
        try {
            await BlogModel.insertMany([{...b}]);
        } catch (e) {
            console.log(e);
        }
        // todo: а если ошибка из БД?
        //  if (e instanceof MongoAPIError.message) {return e.message}
        return b;
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

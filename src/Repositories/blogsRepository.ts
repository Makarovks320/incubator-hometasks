import {blogCollection, DEFAULT_PROJECTION} from "./db";

export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}

export const blogsRepository = {
    async findBlogById(id: string): Promise<Blog | null> {
        return blogCollection.findOne({id},{ projection: DEFAULT_PROJECTION});
    },
    async createNewBlog(b: Blog): Promise<Blog> {
        try {
            await blogCollection.insertOne({...b});
        } catch (e) {
            console.log(e);
        }
        // todo: а если ошибка из БД? как раскукожить ошибку из try catch(e) и обработать
        // возвращаем p, хотя в базу ничего не записалось из-за ошибки
        return b;
    },
    async updateBlogById(id: string, b: Blog): Promise<boolean> {
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

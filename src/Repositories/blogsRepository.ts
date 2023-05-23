import {blogCollection, client} from "./db";

export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export const blogsRepository = {
    async getBlogs(): Promise<Blog[]> {
        return blogCollection.find().toArray();
    },
    async findBlogById(id: string): Promise<Blog | null> {
        return blogCollection.findOne({id});
    },
    async createNewBlog(p: Blog): Promise<Blog> {
        try {
            await client.db('ht_05').collection('blogs').insertOne({...p});
        } catch (e) {
            console.log(e);
        }
        // todo: а если ошибка из БД? как раскукожить ошибку из try catch(e) и обработать
        // возвращаем p, хотя в базу ничего не записалось из-за ошибки
        return p;
    },
    async updateBlogById(id: string, p: Blog): Promise<boolean> {
        const result = await blogCollection.updateOne({id}, {"$set": {...p}});
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

import {Blog, blogsRepository} from "../Repositories/blogsRepository";

type InputBlog = {//todo: Верно ли, что надо объявлять 2 типа блога: из реквеста и для БД?
    name: string,
    description: string,
    websiteUrl: string
}
export const blogService = {
    async getBlogById(id: string): Promise<Blog | null> {
        return blogsRepository.findBlogById(id);
    },
    async createNewBlog(p: InputBlog): Promise<Blog> {
        const blog = {
            id: new Date().valueOf().toString(),
            ...p,
            isMembership: false,
            createdAt: (new Date()).toISOString()
        }
        return await blogsRepository.createNewBlog(blog);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updateBlogById(id: string, p: Blog): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, p);
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsRepository.deleteAllBlogs();
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id);
    }
}

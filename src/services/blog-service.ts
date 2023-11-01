import {blogsRepository} from "../repositories/blogs-repository";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {createBlogInputModel} from "../models/blog/create-input-blog-model";

export const blogService = {
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogById(id);
    },
    async createNewBlog(p: createBlogInputModel): Promise<BlogViewModel> {
        const blog = {
            id: new Date().valueOf().toString(),
            ...p,
            isMembership: false,
            createdAt: (new Date()).toISOString()
        }
        return await blogsRepository.createNewBlog(blog);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updateBlogById(id: string, p: BlogViewModel): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, p);
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsRepository.deleteAllBlogs();
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id);
    }
}

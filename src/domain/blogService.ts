import {blog, blogsRepository} from "../Repositories/blogsRepository";

export const blogService = {
    async getBlogs() {
        return await blogsRepository.getBlogs();
    },
    async getBlogById(id: string): Promise<blog | null> {
        return blogsRepository.findBlogById(id);
    },
    async createNewBlog(p: blog): Promise<blog> {
        const blog = {
            id: new Date().valueOf().toString(),
            ...p
        }
        return await blogsRepository.createNewBlog(blog);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updateBlogById(id: string, p: blog): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, p);
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsRepository.deleteAllBlogs();
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id);
    }
}

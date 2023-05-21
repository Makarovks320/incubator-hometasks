import {blog, blogsRepository} from "../Repositories/blogsRepository";

type inputBlog = {//todo: Верно ли, что надо объявлять 2 типа блога: из реквеста и для БД?
    name: string,
    description: string,
    websiteUrl: string
}

export const blogService = {
    async getBlogs() {
        return await blogsRepository.getBlogs();
    },
    async getBlogById(id: string): Promise<blog | null> {
        return blogsRepository.findBlogById(id);
    },
    async createNewBlog(p: inputBlog): Promise<blog> {
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

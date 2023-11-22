import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {CreateBlogInputModel} from "../models/blog/create-input-blog-model";
import {BlogDBModel} from "../models/blog/blog-db-model";

export class BlogService {
    constructor(private blogsRepository: BlogsRepository) {}
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        return this.blogsRepository.findBlogById(id);
    }
    async createNewBlog(p: CreateBlogInputModel): Promise<BlogViewModel | string> {
        const blog: BlogDBModel = {
            id: new Date().valueOf().toString(),
            ...p,
            isMembership: false,
            createdAt: (new Date()).toISOString()
        }
        return await this.blogsRepository.createNewBlog(blog);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    }
    async updateBlogById(id: string, p: BlogViewModel): Promise<boolean> {
        return await this.blogsRepository.updateBlogById(id, p);
    }
    async deleteAllBlogs(): Promise<void> {
        await this.blogsRepository.deleteAllBlogs();
    }
    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogById(id);
    }
}

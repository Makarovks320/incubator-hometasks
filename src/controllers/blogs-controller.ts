import {Request, Response} from "express";
import {BlogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {BlogService} from "../services/blog-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {BlogQueryParams} from "../models/blog/blog-query-params-type";
import {PostQueryParams} from "../models/post/post-query-params-type";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {inject, injectable} from "inversify";
import {getBlogQueryParams, getPostQueryParams} from "../helpers/get-query-params";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogService) private blogService: BlogService,
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository
    ) {
    }

    async getBlogs(req: Request, res: Response) {
        const queryParams: BlogQueryParams = getBlogQueryParams(req);
        const blogs = await this.blogsQueryRepository.getBlogs(queryParams);
        res.send(blogs);
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogService.getBlogById(req.params.id);
        blog ? res.send(blog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async createNewBlog(req: Request, res: Response) {
        const result: BlogViewModel | string = await this.blogService.createNewBlog(req.body);
        if (result === 'string') {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(result);
    }

    async getPostsByBlogId(req: Request, res: Response) {
        const blog = await this.blogService.getBlogById(req.params.id);
        if (blog) {
            const queryParams: PostQueryParams = getPostQueryParams(req);
            const posts = await this.postsQueryRepository.getPosts(queryParams, req.params.id);
            res.send(posts);
        } else {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        }
    }

    async updateBlog(req: Request, res: Response) {
        const newBlog = await this.blogService.updateBlogById(req.params.id, req.body);
        newBlog ? res.status(HTTP_STATUSES.NO_CONTENT_204).send(newBlog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteAllBlogs(req: Request, res: Response) {
        await this.blogService.deleteAllBlogs();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async deleteBlogById(req: Request, res: Response) {
        const isBlogDeleted = await this.blogService.deleteBlogById(req.params.id);
        isBlogDeleted ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }
}

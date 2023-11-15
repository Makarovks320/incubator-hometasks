import {Request, Response} from "express";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {blogService} from "../services/blog-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {BlogQueryParams} from "../models/blog/blog-query-params-type";
import {PostQueryParams} from "../models/post/post-query-params-type";
import {BlogViewModel} from "../models/blog/blog-view-model";

export const blogsController = {
    async getBlogs(req: Request, res: Response) {
        const queryParams: BlogQueryParams = {
            searchNameTerm: req.query.searchNameTerm as string || null,
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy as string || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
        const blogs = await blogsQueryRepository.getBlogs(queryParams);
        res.send(blogs);
    },

    async getBlogById(req: Request, res: Response) {
        const blog = await blogService.getBlogById(req.params.id);
        blog ? res.send(blog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    },

    async createNewBlog(req: Request, res: Response) {
        const result: BlogViewModel | string = await blogService.createNewBlog(req.body);
        if (result === 'string') {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(result);
    },

    async getPostsByBlogId(req: Request, res: Response) {
        const blog = await blogService.getBlogById(req.params.id);
        if (blog) {
            const queryParams: PostQueryParams = {
                pageNumber: parseInt(req.query.pageNumber as string) || 1,
                pageSize: parseInt(req.query.pageSize as string) || 10,
                sortBy: req.query.sortBy as string || 'createdAt',
                sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
            }
            const posts = await postsQueryRepository.getPosts(queryParams, req.params.id);
            res.send(posts);
        } else {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        }
    },

    async updateBlog(req: Request, res: Response) {
        const newBlog = await blogService.updateBlogById(req.params.id, req.body);
        newBlog ? res.status(HTTP_STATUSES.NO_CONTENT_204).send(newBlog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    },

    async deleteAllBlogs(req: Request, res: Response) {
        await blogService.deleteAllBlogs();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },

    async deleteBlogById(req: Request, res: Response) {
        const isBlogDeleted = await blogService.deleteBlogById(req.params.id);
        isBlogDeleted ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }
}

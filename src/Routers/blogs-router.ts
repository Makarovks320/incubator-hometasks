import {Request, Response, Router} from "express";
import {param} from "express-validator";
import {blogService} from "../domain/blog-service";
import {authorization} from "../Middlewares/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../Middlewares/blogs-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {BlogQueryParams, blogsQueryRepository} from "../Repositories/blogs-query-repository";
import {PostQueryParams, postsQueryRepository} from "../Repositories/posts-query-repository";
import {checkBlogExists} from "../Middlewares/check-blog-exists";
import {idFromUrlExistingValidator} from "../Middlewares/id-from-url-existing-validator";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../Middlewares/posts-validations";
import {InputPost, postService} from "../domain/post-service";
import {STATUSES_HTTP} from "../enums/http-statuses";

export const blogsRouter = Router();
blogsRouter.get('/', async (req: Request, res: Response) => {
    const queryParams: BlogQueryParams = {
        searchNameTerm: req.query.searchNameTerm as string || null,
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }
    const blogs = await blogsQueryRepository.getBlogs(queryParams);
    res.send(blogs);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id);
    blog ? res.send(blog) :res.send(STATUSES_HTTP.NOT_FOUND_404);
});

blogsRouter.post('/', [
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const blogs = await blogService.createNewBlog(req.body);
        res.status(STATUSES_HTTP.CREATED_201).send(blogs);
    }
]);

blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id);
    if (blog) {
        const queryParams: PostQueryParams = {
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy as string || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ?'asc' : 'desc'
        }
        const posts = await postsQueryRepository.getPosts(queryParams, req.params.id);
        res.send(posts);
    } else {
        res.status(STATUSES_HTTP.NOT_FOUND_404).send();
    }
});

blogsRouter.post('/:id/posts', [
    authorization,
    param('id').custom(checkBlogExists).withMessage('blog is not found'),
    idFromUrlExistingValidator,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const post: InputPost = {
            ...req.body,
            blogId: req.params.id,
            blogName: req.blogName
        }
        const newPost = await postService.createNewPost(post);
        res.status(STATUSES_HTTP.CREATED_201).send(newPost);
    }
]);

blogsRouter.put('/:id', [
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const newBlog = await blogService.updateBlogById(req.params.id, req.body);
        newBlog ? res.status(STATUSES_HTTP.NO_CONTENT_204).send(newBlog) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    }
]);

blogsRouter.delete('/', [
    authorization,
    async (req: Request, res: Response) => {
        await blogService.deleteAllBlogs();
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    }
]);

blogsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const blog = await blogService.deleteBlogById(req.params.id);
        blog ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.status(STATUSES_HTTP.NOT_FOUND_404).send();
    }
]);

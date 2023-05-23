import {Request, Response, Router} from "express";
import {blogService} from "../domain/blogService";
import {authorization} from "../Middlewares/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../Middlewares/blogsValidations";
import {inputValidator} from "../Middlewares/inputValidator";
import {BlogQueryParams, blogsQueryRepository} from "../Repositories/blogsQueryRepository";

export const blogsRouter = Router();
blogsRouter.get('/', async (req: Request, res: Response) => {
    const queryParams: BlogQueryParams = {
        searchNameTerm: req.query.searchNameTerm as string || null,
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: String(req.query.sortBy) || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ?'asc' : 'desc'
    }
    const blogs = await blogsQueryRepository.getBlogs(queryParams);
    res.send(blogs);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogs = await blogService.getBlogById(req.params.id);
    res.send(blogs);
});

blogsRouter.post('/',
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const blogs = await blogService.createNewBlog(req.body);
        res.send(blogs);
    });

blogsRouter.put('/:id',
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const newBlog = await blogService.updateBlogById(req.params.id, req.body);
        newBlog ? res.send(newBlog) : res.send(404);

    });

blogsRouter.delete('/',
    authorization,
    async (req: Request, res: Response) => {
        await blogService.deleteAllBlogs();
        res.sendStatus(204);
    });

blogsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const blog = await blogService.deleteBlogById(req.params.id);
        blog ? res.status(204).send() : res.status(404).send();
    }
]);

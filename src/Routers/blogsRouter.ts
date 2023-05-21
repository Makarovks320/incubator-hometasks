import {Request, Response, Router} from "express";
import {blogService} from "../domain/blogService";
import {authorization} from "../Middlewares/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../Middlewares/blogsValidations";
import {inputValidator} from "../Middlewares/inputValidator";

export const blogsRouter = Router();
blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogService.getBlogs();
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

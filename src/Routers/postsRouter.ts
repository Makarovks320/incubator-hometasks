import {Request, Response, Router} from "express";
import {InputPost, postService} from "../domain/postService";
import {authorization} from "../Middlewares/authorization";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../Middlewares/postsValidations";
import {inputValidator} from "../Middlewares/inputValidator";
import {checkIdFromUri} from "../Middlewares/checkIdFromUri";
import {postsQueryRepository} from "../Repositories/postsQueryRepository";
import {PostQueryParams} from "../Repositories/postsQueryRepository";

export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response) => {
    const queryParams: PostQueryParams = {
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy?.toString() || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }
    const posts = await postsQueryRepository.getPosts(queryParams);
    res.send(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const posts = await postService.getPostById(req.params.id);
    posts ? res.send(posts) : res.send(404);
});

postsRouter.post('/', [
    authorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const post: InputPost = {
            ...req.body,
            blogId: req.body.blogId,
            blogName: req.blogName
        }
        const newPost = await postService.createNewPost(post);
        res.status(201).send(newPost);
    }
]);

postsRouter.put('/:id', [
    authorization,
    checkIdFromUri,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const newPost = await postService.updatePostById(req.params.id, req.body)
        newPost ?  res.status(204).send() : res.send(404);
    }
]);

postsRouter.delete('/', [
    authorization,
    async (req: Request, res: Response) => {
        await postService.deleteAllPosts();
        res.sendStatus(204);
    }
]);

postsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const blog = await postService.deletePostById(req.params.id);
        blog ? res.status(204).send() : res.status(404).send();
    }
]);

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
import { authMiddleware } from "../Middlewares/authMiddleware";
import { commentContentValidation } from "../Middlewares/commentValidations";
import {commentService, InputComment } from "../domain/commentService";
import {param} from "express-validator";
import {checkPostExists} from "../Middlewares/checkPostExists";
import {idFromUrlExistingValidator} from "../Middlewares/idFromUrlExistingValidator";
import {commentQueryRepository} from "../Repositories/commentQueryRepository";

export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response) => {
    const queryParams: PostQueryParams = {
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string|| 'createdAt',
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

// комментарии

postsRouter.get('/:id/comments', [
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    async (req: Request, res: Response) => {
        const queryParams: PostQueryParams = {
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy as string|| 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
        const comments = await commentQueryRepository.getCommentsForPost(req.params.id, queryParams);
        res.send(comments);
    }
]);

postsRouter.post('/:id/comments', [
    authMiddleware,
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    commentContentValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const comment: InputComment = {
            content: req.body.content,
            postId: req.params.id
        }
        const newComment = await commentService.createNewComment(comment, req.userId!);
        res.status(201).send(newComment);
    }
]);

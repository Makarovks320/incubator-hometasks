import {Request, Response, Router} from "express";
import {InputPost, postService} from "../domain/post-service";
import {authorization} from "../Middlewares/authorization";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../Middlewares/posts-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {checkIdFromUri} from "../Middlewares/check-id-from-uri";
import {postsQueryRepository} from "../Repositories/posts-query-repository";
import {PostQueryParams} from "../Repositories/posts-query-repository";
import { authMiddleware } from "../Middlewares/auth-middleware";
import { commentContentValidation } from "../Middlewares/comment-validations";
import {commentService, InputCommentWithPostId } from "../domain/comment-service";
import {param} from "express-validator";
import {checkPostExists} from "../Middlewares/check-post-exists";
import {idFromUrlExistingValidator} from "../Middlewares/id-from-url-existing-validator";
import {commentQueryRepository} from "../Repositories/comment-query-repository";
import mongoose from "mongoose";
import {STATUSES_HTTP} from "../enums/http-statuses";

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
    posts ? res.send(posts) : res.send(STATUSES_HTTP.NOT_FOUND_404);
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
        res.status(STATUSES_HTTP.CREATED_201).send(newPost);
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
        newPost ?  res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.send(STATUSES_HTTP.NOT_FOUND_404);
    }
]);

postsRouter.delete('/', [
    authorization,
    async (req: Request, res: Response) => {
        await postService.deleteAllPosts();
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    }
]);

postsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const blog = await postService.deletePostById(req.params.id);
        blog ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.status(STATUSES_HTTP.NOT_FOUND_404).send();
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
        const comment: InputCommentWithPostId = {
            content: req.body.content,
            postId: req.params.id
        }
        const newComment = await commentService.createNewComment(comment, req.userId);
        res.status(STATUSES_HTTP.CREATED_201).send(newComment);
    }
]);

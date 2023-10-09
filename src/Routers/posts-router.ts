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
import {postsController} from "../Controller/posts-controller";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);

postsRouter.get('/:id', postsController.getPostById);

postsRouter.post('/', [
    authorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.createNewPost
]);

postsRouter.put('/:id', [
    authorization,
    checkIdFromUri,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.updatePost
]);

postsRouter.delete('/', [
    authorization,
    postsController.deleteAllPosts
]);

postsRouter.delete('/:id', [
    authorization,
    postsController.deletePostById
]);

// комментарии

postsRouter.get('/:id/comments', [
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    postsController.getCommentsForPost
]);

postsRouter.post('/:id/comments', [
    authMiddleware,
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    commentContentValidation,
    inputValidator,
    postsController.createCommentToPost
]);

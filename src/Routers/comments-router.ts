import {Request, Response, Router} from "express";
import {commentService, InputComment} from "../domain/comment-service";
import {CommentOutput} from "../Repositories/comments-repository";
import {authMiddleware} from "../Middlewares/auth-middleware";
import {OutputUser, userService} from "../domain/user-service";
import {commentContentValidation} from "../Middlewares/comment-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {commentController} from "../Controller/comments-controller";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware,
    commentContentValidation,
    inputValidator,
    commentController.updateComment
]);

commentsRouter.get('/:id', [
    commentController.getCommentById
]);

commentsRouter.delete('/:id', [
    authMiddleware,
    commentController.deleteCommentById
])

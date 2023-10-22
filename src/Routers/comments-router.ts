import {Router} from "express";
import {authMiddleware} from "../Middlewares/auth-middleware";
import {commentContentValidation} from "../Middlewares/comment-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {commentController} from "../Controllers/comments-controller";

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

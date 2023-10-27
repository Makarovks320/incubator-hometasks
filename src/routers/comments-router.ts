import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentContentValidation} from "../middlewares/comment-validations";
import {inputValidator} from "../middlewares/input-validator";
import {commentController} from "../controllers/comments-controller";

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

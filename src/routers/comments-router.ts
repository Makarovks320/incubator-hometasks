import {Router} from "express";
import {authMiddleware} from "../composition-root";
import {commentContentValidation} from "../middlewares/comment-validations";
import {inputValidator} from "../middlewares/input-validator";
import {commentController} from "../composition-root";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentContentValidation,
    inputValidator,
    commentController.updateComment.bind(commentController)
]);

commentsRouter.get('/:id', [
    commentController.getCommentById.bind(commentController)
]);

commentsRouter.delete('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentController.deleteCommentById.bind(commentController)
])

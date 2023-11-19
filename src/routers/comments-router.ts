import {Router} from "express";
import {authMiddleware} from "../composition-root";
import {commentContentValidation, likeStatusValidation} from "../middlewares/comments/comment-validations";
import {inputValidator} from "../middlewares/input-validator";
import {commentController} from "../composition-root";
import {body} from "express-validator";
import {checkCommentExists} from "../middlewares/comments/check-comment-exists";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentContentValidation,
    inputValidator,
    checkCommentExists,
    commentController.updateComment.bind(commentController)
]);

commentsRouter.get('/:id', [
    checkCommentExists,
    commentController.getCommentById.bind(commentController)
]);

commentsRouter.delete('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    checkCommentExists,
    commentController.deleteCommentById.bind(commentController)
]);

commentsRouter.put('/:id/like-status', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    likeStatusValidation,
    inputValidator,
    checkCommentExists,
    commentController.changeLikeStatus.bind(commentController)
]);

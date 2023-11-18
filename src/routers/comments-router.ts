import {Router} from "express";
import {authMiddleware} from "../composition-root";
import {commentContentValidation} from "../middlewares/comment-validations";
import {inputValidator} from "../middlewares/input-validator";
import {commentController} from "../composition-root";
import {body} from "express-validator";
import {checkCommentExists} from "../middlewares/likes/check-comment-exists";

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
    body('likeStatus').isIn(['None', 'Like', 'Dislike']).withMessage("should be in ['None', 'Like', 'Dislike']"),
    inputValidator,
    checkCommentExists,
    commentController.updateComment.bind(commentController)
]);

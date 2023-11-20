import {Router} from "express";
import {authMiddleware} from "../composition-root";
import {commentContentValidation} from "../middlewares/comments/comment-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {commentsController} from "../composition-root";
import {body} from "express-validator";
import {checkCommentExists} from "../middlewares/comments/check-comment-exists";
import {likeStatusValidation} from "../middlewares/likes/like-status-validation";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentContentValidation,
    inputValidator,
    checkCommentExists,
    commentsController.updateComment.bind(commentsController)
]);

commentsRouter.get('/:id', [
    authMiddleware.lookBearerTokenForCurrentUserId.bind(authMiddleware),
    checkCommentExists,
    commentsController.getCommentById.bind(commentsController)
]);

commentsRouter.delete('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    checkCommentExists,
    commentsController.deleteCommentById.bind(commentsController)
]);

commentsRouter.put('/:id/like-status', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    likeStatusValidation,
    inputValidator,
    checkCommentExists,
    commentsController.changeLikeStatus.bind(commentsController)
]);

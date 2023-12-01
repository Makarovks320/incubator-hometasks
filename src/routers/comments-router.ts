import {Router} from "express";
import {container} from "../composition-root";
import {CommentsValidations} from "../middlewares/comments/comments-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {likeStatusValidation} from "../middlewares/likes/like-status-validation";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";
import {CommentsController} from "../controllers/comments-controller";

const authMiddleware = container.resolve(AuthMiddleware);
const commentValidations = container.resolve(CommentsValidations);
const commentsController = container.resolve(CommentsController);
export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentValidations.commentContentValidation,
    inputValidator,
    commentValidations.checkCommentExists.bind(commentValidations),
    commentsController.updateComment.bind(commentsController)
]);

commentsRouter.get('/:id', [
    authMiddleware.lookBearerTokenForCurrentUserId.bind(authMiddleware),
    commentValidations.checkCommentExists.bind(commentValidations),
    commentsController.getCommentById.bind(commentsController)
]);

commentsRouter.delete('/:id', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    commentValidations.checkCommentExists.bind(commentValidations),
    commentsController.deleteCommentById.bind(commentsController)
]);

commentsRouter.put('/:id/like-status', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    likeStatusValidation,
    inputValidator,
    commentValidations.checkCommentExists.bind(commentValidations),
    commentsController.changeLikeStatus.bind(commentsController)
]);

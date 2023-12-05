import {Router} from "express";
import {inputValidator} from "../middlewares/common/input-validator";
import {container} from "../composition-root";
import {idFromUrlExistingValidator} from "../middlewares/common/id-from-url-existing-validator";
import {PostsController} from "../controllers/posts-controller";
import {PostsValidations} from "../middlewares/posts/posts-validations";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";
import {CommentsValidations} from "../middlewares/comments/comments-validations";
import {likeStatusValidation} from "../middlewares/likes/like-status-validation";

const postsController = container.resolve(PostsController);
const postsValidations = container.resolve(PostsValidations);
const commentValidation = container.resolve(CommentsValidations);
const authMiddleware = container.resolve(AuthMiddleware);
export const postsRouter = Router();

postsRouter.get('/', [
    authMiddleware.lookBearerTokenForCurrentUserId.bind(authMiddleware),
    postsController.getPosts.bind(postsController)
]);

postsRouter.get('/:id', [
    authMiddleware.lookBearerTokenForCurrentUserId.bind(authMiddleware),
    postsController.getPostById.bind(postsController)
]);

postsRouter.post('/', [
    authMiddleware.checkBasicAuthorization.bind(authMiddleware),
    postsValidations.titleValidation.bind(postsValidations),
    postsValidations.shortDescriptionValidation.bind(postsValidations),
    postsValidations.contentValidation.bind(postsValidations),
    postsValidations.blogIdValidation.bind(postsValidations),
    inputValidator,
    postsController.createNewPost.bind(postsController)
]);

postsRouter.put('/:id', [
    authMiddleware.checkBasicAuthorization.bind(authMiddleware),
    postsValidations.checkPostIdFromUri.bind(postsValidations),
    postsValidations.titleValidation.bind(postsValidations),
    postsValidations.shortDescriptionValidation.bind(postsValidations),
    postsValidations.contentValidation.bind(postsValidations),
    postsValidations.blogIdValidation.bind(postsValidations),
    inputValidator,
    postsController.updatePost.bind(postsController)
]);
postsRouter.put('/:id/like-status', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    likeStatusValidation,
    inputValidator,
    postsValidations.checkPostExists.bind(postsValidations),
    postsController.changeLikeStatus.bind(postsController)
])

postsRouter.delete('/', [
    authMiddleware.checkBasicAuthorization.bind(authMiddleware),
    postsController.deleteAllPosts.bind(postsController)
]);

postsRouter.delete('/:id', [
    authMiddleware.checkBasicAuthorization.bind(authMiddleware),
    postsController.deletePostById.bind(postsController)
]);

// комментарии
postsRouter.get('/:id/comments', [
    authMiddleware.lookBearerTokenForCurrentUserId.bind(authMiddleware),
    postsValidations.checkPostExists.bind(postsValidations),
    idFromUrlExistingValidator,
    postsController.getCommentsForPost.bind(postsController)
]);

postsRouter.post('/:id/comments', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    postsValidations.checkPostExists.bind(postsValidations),
    idFromUrlExistingValidator,
    commentValidation.commentContentValidation,
    inputValidator,
    postsController.createCommentToPost.bind(postsController)
]);

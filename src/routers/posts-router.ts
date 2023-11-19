import {Router} from "express";
import {authorization} from "../middlewares/auth/authorization";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts/posts-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {checkPostIdFromUri} from "../middlewares/posts/check-post-id-from-uri";
import {authMiddleware} from "../composition-root";
import {commentContentValidation} from "../middlewares/comments/comment-validations";
import {param} from "express-validator";
import {checkPostExists} from "../middlewares/posts/check-post-exists";
import {idFromUrlExistingValidator} from "../middlewares/common/id-from-url-existing-validator";
import {postsController} from "../composition-root";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts.bind(postsController));

postsRouter.get('/:id', postsController.getPostById.bind(postsController));

postsRouter.post('/', [
    authorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.createNewPost.bind(postsController)
]);

postsRouter.put('/:id', [
    authorization,
    checkPostIdFromUri,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.updatePost.bind(postsController)
]);

postsRouter.delete('/', [
    authorization,
    postsController.deleteAllPosts.bind(postsController)
]);

postsRouter.delete('/:id', [
    authorization,
    postsController.deletePostById.bind(postsController)
]);

// комментарии

postsRouter.get('/:id/comments', [
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    postsController.getCommentsForPost.bind(postsController)
]);

postsRouter.post('/:id/comments', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    commentContentValidation,
    inputValidator,
    postsController.createCommentToPost.bind(postsController)
]);

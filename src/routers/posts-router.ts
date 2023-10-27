import {Router} from "express";
import {authorization} from "../middlewares/authorization";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validations";
import {inputValidator} from "../middlewares/input-validator";
import {checkIdFromUri} from "../middlewares/check-id-from-uri";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentContentValidation} from "../middlewares/comment-validations";
import {param} from "express-validator";
import {checkPostExists} from "../middlewares/check-post-exists";
import {idFromUrlExistingValidator} from "../middlewares/id-from-url-existing-validator";
import {postsController} from "../controllers/posts-controller";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);

postsRouter.get('/:id', postsController.getPostById);

postsRouter.post('/', [
    authorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.createNewPost
]);

postsRouter.put('/:id', [
    authorization,
    checkIdFromUri,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator,
    postsController.updatePost
]);

postsRouter.delete('/', [
    authorization,
    postsController.deleteAllPosts
]);

postsRouter.delete('/:id', [
    authorization,
    postsController.deletePostById
]);

// комментарии

postsRouter.get('/:id/comments', [
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    postsController.getCommentsForPost
]);

postsRouter.post('/:id/comments', [
    authMiddleware,
    param('id').custom(checkPostExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    commentContentValidation,
    inputValidator,
    postsController.createCommentToPost
]);

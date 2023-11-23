import {Router} from "express";
import {inputValidator} from "../middlewares/common/input-validator";
import {idFromUrlExistingValidator} from "../middlewares/common/id-from-url-existing-validator";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogs-controller";
import {PostsController} from "../controllers/posts-controller";
import {BlogsValidations} from "../middlewares/blogs/blogs-validations";
import {PostsValidations} from "../middlewares/posts/posts-validations";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";

const blogsController = container.resolve(BlogsController);
const postsController = container.resolve(PostsController);
const blogsValidations = container.resolve(BlogsValidations);
const postsValidations = container.resolve(PostsValidations);
const authMiddleware = container.resolve(AuthMiddleware);

export const blogsRouter = Router();
blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController));

blogsRouter.post('/', [
    authMiddleware.checkBasicAuthorization,
    blogsValidations.nameValidation.bind(blogsValidations),
    blogsValidations.websiteUrlValidation.bind(blogsValidations),
    blogsValidations.descriptionValidation.bind(blogsValidations),
    inputValidator,
    blogsController.createNewBlog.bind(blogsController)
]);

blogsRouter.get('/:id/posts', blogsController.getPostsByBlogId.bind(blogsController));

blogsRouter.post('/:id/posts', [
    authMiddleware.checkBasicAuthorization,
    blogsValidations.checkBlogExists.bind(blogsValidations),
    idFromUrlExistingValidator,
    postsValidations.titleValidation.bind(postsValidations),
    postsValidations.shortDescriptionValidation.bind(postsValidations),
    postsValidations.contentValidation.bind(postsValidations),
    inputValidator,
    postsController.createNewPost
]);

blogsRouter.put('/:id', [
    authMiddleware.checkBasicAuthorization,
    blogsValidations.nameValidation.bind(blogsValidations),
    blogsValidations.websiteUrlValidation.bind(blogsValidations),
    blogsValidations.descriptionValidation.bind(blogsValidations),
    inputValidator,
    blogsController.updateBlog.bind(blogsController)
]);

blogsRouter.delete('/', [
    authMiddleware.checkBasicAuthorization,
    blogsController.deleteAllBlogs.bind(blogsController)
]);

blogsRouter.delete('/:id', [
    authMiddleware.checkBasicAuthorization,
    blogsController.deleteBlogById.bind(blogsController)
]);

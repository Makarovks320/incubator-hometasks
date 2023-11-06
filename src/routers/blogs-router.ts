import {Router} from "express";
import {param} from "express-validator";
import {authorization} from "../middlewares/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../middlewares/blogs-validations";
import {inputValidator} from "../middlewares/input-validator";
import {checkBlogExists} from "../middlewares/check-blog-exists";
import {idFromUrlExistingValidator} from "../middlewares/id-from-url-existing-validator";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validations";
import {blogsController} from "../controllers/blogs-controller";
import {postsController} from "../controllers/posts-controller";

export const blogsRouter = Router();
blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id', blogsController.getBlogById);

blogsRouter.post('/', [
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    blogsController.createNewBlog
]);

blogsRouter.get('/:id/posts', blogsController.getPostsByBlogId);

blogsRouter.post('/:id/posts', [
    authorization,
    param('id').custom(checkBlogExists).withMessage('blog is not found'),
    idFromUrlExistingValidator,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidator,
    postsController.createNewPost
]);

blogsRouter.put('/:id', [
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    blogsController.updateBlog
]);

blogsRouter.delete('/', [
    authorization,
    blogsController.deleteAllBlogs
]);

blogsRouter.delete('/:id', [
    authorization,
    blogsController.deleteBlogById
]);

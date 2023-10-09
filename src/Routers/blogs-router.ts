import {Router} from "express";
import {param} from "express-validator";
import {authorization} from "../Middlewares/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../Middlewares/blogs-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {checkBlogExists} from "../Middlewares/check-blog-exists";
import {idFromUrlExistingValidator} from "../Middlewares/id-from-url-existing-validator";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../Middlewares/posts-validations";
import {blogsController} from "../Controller/blogs-controller";

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
    blogsController.createPostForBlog
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

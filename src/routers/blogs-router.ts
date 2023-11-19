import {Router} from "express";
import {param} from "express-validator";
import {authorization} from "../middlewares/auth/authorization";
import {descriptionValidation, nameValidation, websiteUrlValidation} from "../middlewares/blogs/blogs-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {checkBlogExists} from "../middlewares/blogs/check-blog-exists";
import {idFromUrlExistingValidator} from "../middlewares/common/id-from-url-existing-validator";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts/posts-validations";
import {blogsController} from "../composition-root";
import {postsController} from "../composition-root";

export const blogsRouter = Router();
blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController));

blogsRouter.post('/', [
    authorization,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidator,
    blogsController.createNewBlog.bind(blogsController)
]);

blogsRouter.get('/:id/posts', blogsController.getPostsByBlogId.bind(blogsController));

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
    blogsController.updateBlog.bind(blogsController)
]);

blogsRouter.delete('/', [
    authorization,
    blogsController.deleteAllBlogs.bind(blogsController)
]);

blogsRouter.delete('/:id', [
    authorization,
    blogsController.deleteBlogById.bind(blogsController)
]);

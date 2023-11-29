import {body, param} from "express-validator";
import {inject, injectable} from "inversify";
import {BlogsRepository} from "../../repositories/blogs-repository";

@injectable()
export class BlogsValidations {
    constructor(
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {
    }
    checkBlogExists = param('id').custom( async (value, { req}) => {
        const blog = await this.blogsRepository.findBlogById(value);
        if (!blog) {
            throw new Error('Incorrect blog id: blog is not found');
        }
        return true;
    }).withMessage('blog is not found');

    nameValidation = body('name')
        .trim()
        .isLength({max: 15}).withMessage('max length is 15')
        .notEmpty().withMessage('should not be empty');

    descriptionValidation = body('description')
        .trim()
        .isLength({max: 500}).withMessage('max length is 500')
        .notEmpty().withMessage('should not be empty');

// todo: не работает без изменений интерфейса IsURLOptions
// noinspection TypeScriptValidateTypes
    websiteUrlValidation = body('websiteUrl')
        .trim()
        .isLength({max: 100}).withMessage('max length is 100')
        // @ts-ignore
        .isURL({ignore_max_length: true}).withMessage('websiteUrl should be url')
        .notEmpty().withMessage('should not be empty');
}
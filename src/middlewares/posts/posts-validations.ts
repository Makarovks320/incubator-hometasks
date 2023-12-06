import {body, param} from "express-validator";
import {inject, injectable} from "inversify";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import { PostsRepository } from "../../repositories/posts-repository";
import {BlogsRepository} from "../../repositories/blogs-repository";
import {stringToObjectIdMapper} from "../../helpers/string-to-object-id-mapper";
import {PostDocument} from "../../models/post/post-db-model";

@injectable()
export class PostsValidations {
    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {
    }
    titleValidation =  body('title')
        .trim()
        .isLength({max: 30}).withMessage('max length: 30')
        .notEmpty().withMessage('should not be empty');

    shortDescriptionValidation =  body('shortDescription')
        .trim()
        .isLength({max: 100}).withMessage('max length: 100')
        .notEmpty().withMessage('should not be empty');

    contentValidation =  body('content')
        .trim()
        .isLength({max: 1000}).withMessage('max length: 1000')
        .notEmpty().withMessage('should not be empty');

    blogIdValidation = body('blogId').trim()
        .isString().withMessage('should be string')
        .custom(async (value, { req}) => {
            const blog = await this.blogsRepository.findBlogById(value);
            if (!blog) {
                throw new Error('Incorrect blog id: blog is not found');
            }
        })
        .withMessage('blog is not found');

    checkPostExists = param('id').custom(async (value)=> {
        const post: PostDocument | null = await this.postsRepository.findPostById(value);
        if (!post) {
            throw new Error('Incorrect post id: post is not found');
        }
        return true;
    }).withMessage('post is not found');


    async checkPostIdFromUri (req: Request, res: Response, next: NextFunction) {
        const id = req.params.id

        const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
        if (id.length !== 24 || !checkForHexRegExp.test(id)) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send();
            return;
        }

        const exist = await this.postsRepository.findPostById(stringToObjectIdMapper(id));
        exist ? next() :
            res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }
}

import {body} from "express-validator";
import {checkBlogIdExists} from "./checkBlogIdExists";

export const titleValidation =  body('title')
    .trim()
    .isLength({max: 30}).withMessage('max length: 30')
    .notEmpty().withMessage('should not be empty');

export const shortDescriptionValidation =  body('shortDescription')
    .trim()
    .isLength({max: 100}).withMessage('max length: 100')
    .notEmpty().withMessage('should not be empty');

export const contentValidation =  body('content')
    .trim()
    .isLength({max: 1000}).withMessage('max length: 1000')
    .notEmpty().withMessage('should not be empty');

export const blogIdValidation = body('blogId').trim()
    .isString().withMessage('should be string')
    .custom(checkBlogIdExists).withMessage('blog is not found');

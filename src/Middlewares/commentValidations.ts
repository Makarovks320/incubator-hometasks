import {body} from "express-validator";
import {checkBlogIdExists} from "./checkBlogIdExists";

export const commentContentValidation = body('content')
    .trim()
    .isLength({min: 20}).withMessage('min length: 20')
    .isLength({max: 300}).withMessage('max length: 300')
    .notEmpty().withMessage('should not be empty');

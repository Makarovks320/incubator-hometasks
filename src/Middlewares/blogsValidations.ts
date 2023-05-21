import {body} from "express-validator";

export const nameValidation = body('name')
    .trim()
    .isLength({max: 15}).withMessage('max length is 15')
    .notEmpty().withMessage('should not be empty');

export const descriptionValidation = body('description')
    .trim()
    .isLength({max: 500}).withMessage('max length is 15')
    .notEmpty().withMessage('should not be empty');

export const websiteUrlValidation = body('websiteUrl')
    .trim()
    .isLength({max: 100}).withMessage('max length is 100')
    .isURL().withMessage('websiteUrl should be url')
    .notEmpty().withMessage('should not be empty');

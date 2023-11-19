import {body} from "express-validator";

export const loginOrEmailAuthValidation =  body('loginOrEmail')
    .isString().withMessage('should be string')
    .notEmpty().withMessage('should not be empty');

export const loginAuthValidation =  body('login')
    .isLength({min: 3}).withMessage('min length is 3')
    .isLength({max: 10}).withMessage('max length is 10')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('should match pattern');

export const emailAuthValidation =  body('email')
    .isString().withMessage('should be string')
    .notEmpty().withMessage('should not be empty')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('should match pattern');

export const passwordAuthValidation =  body('password')
    .isLength({min: 6}).withMessage('min length is 6')
    .isLength({max: 20}).withMessage('max length is 20')
    .notEmpty().withMessage('should not be empty');



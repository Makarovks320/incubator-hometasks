import {body} from "express-validator";

export const loginValidation =  body('login')
    .trim()
    .isString().withMessage('should be string')
    .isLength({max: 30, min: 3}).withMessage('max length: 30, min length: 3')
    .notEmpty().withMessage('should not be empty')
    .matches(/^[a-zA-Z0-9_-]*$/, 'i')
    .withMessage('Некорректный формат логина');

export const passwordValidation =  body('password')
    .trim()
    .isString().withMessage('should be string')
    .isLength({max: 20, min: 6}).withMessage('max length: 20, min length: 6');

export const emailValidation =  body('email')
    .trim()
    .isString().withMessage('should be string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'i')
    .withMessage('Некорректный формат почты');


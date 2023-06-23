import {body} from "express-validator";

export const loginOrEmailAuthValidation =  body('loginOrEmail')
    .isString().withMessage('should be string')
    .notEmpty().withMessage('should not be empty');

export const passwordAuthValidation =  body('password')
    .isString().withMessage('should be string')
    .notEmpty().withMessage('should not be empty');


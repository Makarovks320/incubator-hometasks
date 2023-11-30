import {body} from "express-validator";

export const likeStatusValidation = body('likeStatus')
    .trim()
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage("should be in ['None', 'Like', 'Dislike']");
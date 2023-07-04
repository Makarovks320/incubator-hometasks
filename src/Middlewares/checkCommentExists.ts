import {CustomValidator} from "express-validator";
import {commentsRepository} from "../Repositories/commentsRepository";

export const checkCommentExists: CustomValidator = async (value)=> {
    const comment = await commentsRepository.getCommentById(value);
    if (!comment) {
        throw new Error('Incorrect comment id: comment is not found');
    }
    return true;
};

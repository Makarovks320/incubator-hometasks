import {CustomValidator} from "express-validator";
import {postsRepository} from "../composition-root";

export const checkPostExists: CustomValidator = async (value)=> {
    const post = await postsRepository.findPostById(value);
    if (!post) {
        throw new Error('Incorrect post id: post is not found');
    }
    return true;
};

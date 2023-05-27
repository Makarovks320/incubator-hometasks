import {blogsRepository} from "../Repositories/blogsRepository";
import {CustomValidator} from "express-validator";

export const checkBlogIdExists: CustomValidator = async (value, { req }) => {
    const blog = await blogsRepository.findBlogById(value);
    if (!blog) {
        throw new Error('Incorrect blog id: blog is not found');
    }
    // сразу добавляем в реквест имя блога, чтобы потом не обращаться за ним лишний раз в БД
    req.body.blogName = blog.name;//todo: в body! Самое удобрное решение, но Димыча говорил нельзя так
    return true;
};

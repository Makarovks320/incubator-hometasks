import {blogsRepository} from "../composition-root";
import {CustomValidator} from "express-validator";

export const checkBlogExists: CustomValidator = async (value, { req}) => {
    const blog = await blogsRepository.findBlogById(value);
    if (!blog) {
        throw new Error('Incorrect blog id: blog is not found');
    }
    // сразу добавляем в реквест имя блога, чтобы потом не обращаться за ним лишний раз в БД
    req.blogName = blog.name;
    return true;
};

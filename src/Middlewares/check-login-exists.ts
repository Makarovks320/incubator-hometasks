import {CustomValidator} from "express-validator";
import {usersRepository} from "../Repositories/users-repository";

export const checkLoginExists: CustomValidator = async (value, { req}) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (user) {
        throw new Error('Incorrect user login: login already exists');
    }
    return true;
};
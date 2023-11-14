import {CustomValidator} from "express-validator";
import {usersRepositoryInstance} from "../repositories/users-repository";

export const checkLoginExists: CustomValidator = async (value, { req}) => {
    const user = await usersRepositoryInstance.findUserByLoginOrEmail(value);
    if (user) {
        throw new Error('Incorrect user login: login already exists');
    }
    return true;
};

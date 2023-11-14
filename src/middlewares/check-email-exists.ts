import {CustomValidator} from "express-validator";
import {usersRepositoryInstance} from "../repositories/users-repository";

export const checkEmailExists: CustomValidator = async (value, { req}) => {
    const user = await usersRepositoryInstance.findUserByLoginOrEmail(value);
    if (user) {
        throw new Error('Incorrect user email: email already exists');
    }
    return true;
};

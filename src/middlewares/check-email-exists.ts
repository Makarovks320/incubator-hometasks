import {CustomValidator} from "express-validator";
import {usersRepository} from "../repositories/users-repository";

export const checkEmailExists: CustomValidator = async (value, { req}) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (user) {
        throw new Error('Incorrect user email: email already exists');
    }
    return true;
};

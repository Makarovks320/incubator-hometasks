import {CustomValidator} from "express-validator";
import {usersRepositoryInstance} from "../repositories/users-repository";

export const checkConfirmationData: CustomValidator = async (value, { req}) => {
    if (!value) return true;
    const user = await usersRepositoryInstance.findUserByConfirmationCodeOrEmail(value);
    //todo: Дублирование обращения к БД здесь и в auth-service
    if (!user) {
        throw new Error('code or email doesnt exist');
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error('user is already confirmed');
    }
    return true;
};

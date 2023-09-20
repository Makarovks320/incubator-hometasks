import {CustomValidator} from "express-validator";
import {usersRepository} from "../Repositories/users-repository";

export const checkConfirmationData: CustomValidator = async (value, { req}) => {
    if (!value) return true;
    const user = await usersRepository.findUserByConfirmationCodeOrEmail(value);
    //todo: Дублирование обращения к БД здесь и в auth-service
    if (!user) {
        throw new Error('code or email doesnt exist');
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error('user is already confirmed');
    }
    return true;
};

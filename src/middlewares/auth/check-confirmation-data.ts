import {CustomValidator} from "express-validator";
import {usersRepository} from "../../composition-root";

export const checkConfirmationData: CustomValidator = async (value, { req}) => {
    if (!value) return true;
    const user = await usersRepository.findUserByConfirmationCodeOrEmail(value);
    if (!user) {
        throw new Error('code or email doesnt exist');
    }
    if (user.emailConfirmation.isConfirmed) {
        throw new Error('user is already confirmed');
    }
    return true;
};

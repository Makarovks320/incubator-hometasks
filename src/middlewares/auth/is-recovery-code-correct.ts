import {CustomValidator} from "express-validator";
import {UserDBModel} from "../../models/user/user-db-model";
import {UsersQueryRepository} from "../../repositories/query-repositories/users-query-repository";
import jwt from "jsonwebtoken";

/*
    миддлвар проверяет RecoveryCode (Был ли такой код выдан? Код активироан? Код не истек?)
* */
export class RecoveryCodeValidator {
    constructor(
        protected usersQueryRepository: UsersQueryRepository
    ) {
    }
    // @ts-ignore
    async isRecoveryCodeCorrect (value: string, {req}): Promise<boolean> {
        const user: UserDBModel | null = await this.usersQueryRepository.findUserByPassRecoveryCode(value);

        if (!user) throw new Error('Confirmation code is incorrect');

        if (user.passwordRecovery.active) {
            throw new Error('Confirmation code has been activated');
        }

        // Check that the token is not expired
        try {
            await jwt.verify(value, process.env.JWT_SECRET!)
        } catch (e) {
            throw new Error('Token is expired');
        }

        req.userId = user._id;
        return true;
    };
}

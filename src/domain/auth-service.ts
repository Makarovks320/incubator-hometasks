import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepository, UserAccountDBType} from "../Repositories/users-repository";
import {emailManager} from "../Managers/emailManager";


export const authService = {
    async createUser(login: string, email: string, password: string): Promise<UserAccountDBType | null> {
        const passwordSalt = await bcrypt.genSalt(8);
        const passwordHash = await this._generateHash(password, passwordSalt);
        const user: UserAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(user);
        try {
            await emailManager.sendConformationCode(email, user.emailConfirmation.confirmationCode);
        } catch (e) {
            console.log(e);
            await usersRepository.deleteUserById(user._id);
            return null;
        }
        return createResult;
    },
    async confirmEmailByCodeOrEmail(codeOrEmail: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCodeOrEmail(codeOrEmail);
        if (!user) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;

        const result = await usersRepository.updateConfirmation(user._id);
        return result;
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}

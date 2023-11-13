import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/emailManager";
import {EmailConfirmationType, UserDBModel} from "../models/user/user-db-model";
import {jwtService} from "../application/jwt-service";


export const authService = {
    async createUser(login: string, email: string, password: string): Promise<UserDBModel | null> {
        const passwordSalt = await bcrypt.genSalt(8);
        const passwordHash = await this._generateHash(password, passwordSalt);
        const user: UserDBModel = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt: (new Date()).toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), { minutes: 15 }),
                isConfirmed: false
            },
            passwordRecovery: {
                passwordRecoveryCode: "",
                active: false
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

        const result = await usersRepository.confirmUserById(user._id);
        return result;
    },
    async sendEmailWithNewCode(email: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCodeOrEmail(email);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        const emailConfirmation: EmailConfirmationType = {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), { minutes: 15 }),
                isConfirmed: false
        }
        await usersRepository.updateConfirmationCode(user._id, emailConfirmation);
        await emailManager.sendNewConformationCode(user.accountData.email, emailConfirmation.confirmationCode)
        return true; //todo: как я могу уверенно вернуть true, если я не могу контролировать emailManager?

    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    },
    async sendEmailWithRecoveryPasswordCode(email: string): Promise<boolean> {
        const userDB: UserDBModel | null = await usersRepository.findUserByLoginOrEmail(email)
        // Return true even if current email is not registered (for prevent user's email detection)
        if (!userDB) return true;
        const passwordRecoveryCode = await jwtService.createAccessToken(userDB._id);
        await usersRepository.addPassRecoveryCode(userDB._id, passwordRecoveryCode);

        try {
            await emailManager.sendPasswordRecoveryMessage(userDB.accountData.email, passwordRecoveryCode);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }

    },
    async updatePassword(newPassword: string, userId: ObjectId): Promise<boolean> {
        const user: UserDBModel | null = await usersRepository.getUserById(userId);
        if (!user) return false;
        const passwordSalt: string = user.accountData.salt;
        const newPasswordHash = await this._generateHash(newPassword, passwordSalt);
        return await usersRepository.updatePassword(newPasswordHash, userId);
    }
}

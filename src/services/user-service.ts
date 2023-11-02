import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt';
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserDBModel} from "../models/user/user-model";

export type InputUser = {
    login: string,
    email: string,
    password: string
}
export const userService = {
    async createUser(u: InputUser): Promise<UserDBModel> {
        const passwordSalt = await bcrypt.genSalt(8);
        const passwordHash = await this._generateHash(u.password, passwordSalt);
        const newUser: UserDBModel = {
            _id: new ObjectId(),
            accountData: {
                userName: u.login,
                email: u.email,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt: (new Date()).toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 15
                }),
                isConfirmed: false
            }
        }
        const result = await usersRepository.createUser(newUser);
        return result;
    },
    async findUserById(id: ObjectId): Promise<UserDBModel | null> {
        return await usersQueryRepository.getUserById(id);
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBModel | null> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const passwordHash = await this._generateHash(password, user.accountData.salt);
        if (user.accountData.hash !== passwordHash) {
            return null;
        } else {
            return user;
        }
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    },
    async deleteUserById(_id:ObjectId): Promise<boolean> {
        return await usersRepository.deleteUserById(_id);
    },
    async deleteAllUsers(): Promise<void> {
        return await usersRepository.deleteAllUsers();
    }
}
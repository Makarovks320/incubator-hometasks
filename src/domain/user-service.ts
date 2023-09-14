import {User, usersRepository} from "../Repositories/users-repository";
import bcrypt from 'bcrypt';
import { usersQueryRepository } from "../Repositories/users-query-repository";
import {ObjectId} from "mongodb";

export type OutputUser = {
    _id: ObjectId,
    userName: string,
    email: string,
    createdAt: string
}
export type InputUser = {
    login: string,
    email: string,
    password: string
}

export const userService = {
// @ts-ignore
    async createUser(u: InputUser): Promise<OutputUser> {
        const passwordSalt = await bcrypt.genSalt(8);
        const passwordHash = await this._generateHash(u.password, passwordSalt);
        const newUser: User = {
            _id: new ObjectId(),
            userName: u.login,
            email: u.email,
            salt: passwordSalt,
            hash: passwordHash,
            createdAt: (new Date()).toISOString()
        }
        const result = await usersRepository.createUser(newUser);
        return {
            _id: result._id,
            userName: result.userName,
            email: result.email,
            createdAt: result.createdAt
        }
    },
    async findUserById(id: ObjectId): Promise<OutputUser | null> {
        return await usersQueryRepository.getUserById(id);
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<User | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const passwordHash = await this._generateHash(password, user.salt);
        if (user.hash !== passwordHash) {
            return null;
        } else {
            return user;
        }
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    },
    async deleteUserById(id:string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    },
    async deleteAllUsers(): Promise<void> {
        return await usersRepository.deleteAllUsers();
    }
}

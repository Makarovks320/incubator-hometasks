import {User, usersRepository} from "../Repositories/usersRepository";
import bcrypt from 'bcrypt';

type OutputUser = {
    id: string,
    login: string,
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
            id: new Date().valueOf().toString(),
            login: u.login,
            email: u.email,
            salt: passwordSalt,
            hash: passwordHash,
            createdAt: (new Date()).toISOString()
        }
        const result = await usersRepository.createUser(newUser);
        return {
            id: result.id,
            login: result.login,
            email: result.email,
            createdAt: result.createdAt
        }
    },
    async findUserById(id: string) {
        return await usersRepository.findUserById(id);
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return false;
        const passwordHash = await this._generateHash(password, user.salt);
        if (user.hash !== passwordHash) {
            return false
        } else {
            return true;
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

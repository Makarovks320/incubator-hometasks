import {UsersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt';
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserDBModel} from "../models/user/user-db-model";
import {CreateUserInputModel} from "../models/user/create-input-user-model";
import {inject, injectable} from "inversify";

@injectable()
export class UserService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}
    async createUser(u: CreateUserInputModel): Promise<UserDBModel> {
        const passwordSalt = await bcrypt.genSalt(8);
        const passwordHash = await this._generateHash(u.password, passwordSalt);
        const newUser = new UserDBModel (
            new ObjectId(),
            {
                userName: u.login,
                email: u.email,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt: (new Date()).toISOString()
            },
            {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 15
                }),
                isConfirmed: false
            },
            {
                passwordRecoveryCode: "",
                active: false
            }
        );

        const result = await this.usersRepository.createUser(newUser);
        return result;
    }
    async findUserById(id: ObjectId): Promise<UserDBModel | null> {
        return await this.usersRepository.getUserById(id);
    }
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBModel | null> {
        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const passwordHash = await this._generateHash(password, user.accountData.salt);
        if (user.accountData.hash !== passwordHash) {
            return null;
        } else {
            return user;
        }
    }
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
    async deleteUserById(_id:ObjectId): Promise<boolean> {
        return await this.usersRepository.deleteUserById(_id);
    }
    async deleteAllUsers(): Promise<void> {
        return await this.usersRepository.deleteAllUsers();
    }
}

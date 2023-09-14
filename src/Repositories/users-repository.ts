import {userCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export type User = {
    _id: ObjectId,
    userName: string,
    email: string,
    salt: string,
    hash: string,
    createdAt: string
}

export const usersRepository = {
    async createUser(user: User) {
        await userCollection.insertOne(user);
        return user;
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = userCollection.findOne({$or: [{userName: loginOrEmail}, {email: loginOrEmail}]});
        return user;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<void> {
        const result = await userCollection.deleteMany({});
    }
}

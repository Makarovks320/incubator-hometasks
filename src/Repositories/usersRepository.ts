import {userCollection} from "./db";

export type User = {
    id: string,
    login: string,
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
        const user = userCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
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

import {blogCollection, userCollection} from "./db";

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
    async findUserById(id: string) {
      const user = userCollection.findOne({id: id})
        return user || null;
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = userCollection.findOne({or: [{login: loginOrEmail}, {email: loginOrEmail}]});
        return user;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({id});
        return result.deletedCount === 1
    }
}

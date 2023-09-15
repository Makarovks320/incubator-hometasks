import {userCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export type UserAccountDBType = {
    _id: ObjectId,
    accountData: {
        userName: string;
        email: string;
        salt: string;
        hash: string;
        createdAt: Date;
    },
    emailConfirmation: {
        confirmationCode: string;
        isConfirmed: boolean;
        expirationDate: Date;
    }
}

export const usersRepository = {
    async createUser(user: UserAccountDBType): Promise<UserAccountDBType> {
        await userCollection.insertOne(user);
        return user;
    },
    async findUserById(id: ObjectId): Promise<UserAccountDBType | null> {
        const user = await userCollection.findOne({_id: id});
        return user ?  user : null;
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
        const user = await userCollection.findOne({$or: [{'accountData.userName': loginOrEmail}, {'accountData.email': loginOrEmail}]});
        return user ?  user : null;
    },
    async findUserByConfirmationCode(code: string): Promise<UserAccountDBType | null> {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code});
        return user;
    },
    async updateConfirmation(_id: ObjectId) {
        const result = await userCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<void> {
        const result = await userCollection.deleteMany({});
    }
}

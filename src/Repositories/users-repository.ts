import {userCollection} from "./db";
import {ObjectId} from "mongodb";
import {EmailConfirmationType, UserDBModel, UserViewModel} from "../Models/user/user-model";
import {getUserViewModel} from "../helpers/user-view-model-mapper";

export const usersRepository = {
    async createUser(user: UserDBModel): Promise<UserViewModel> {
        await userCollection.insertOne(user);
        return getUserViewModel(user);
    },
    async findUserById(id: ObjectId): Promise<UserDBModel | null> {
        const user = await userCollection.findOne({_id: id});
        return user ? user : null;
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await userCollection.findOne({$or: [{'accountData.userName': loginOrEmail}, {'accountData.email': loginOrEmail}]});
        return user ? user : null;
    },
    async findUserByConfirmationCodeOrEmail(codeOrEmail: string): Promise<UserDBModel | null> {
        const user = await userCollection.findOne({$or: [{'emailConfirmation.confirmationCode': codeOrEmail}, {'accountData.email': codeOrEmail}]});
        return user;
    },
    async confirmUserById(_id: ObjectId): Promise<boolean> {
        const result = await userCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },
    async updateConfirmationCode(_id: ObjectId, emailConfirmation: EmailConfirmationType): Promise<boolean> {
        const result = await userCollection.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': emailConfirmation.confirmationCode,
                'emailConfirmation.expirationDate': emailConfirmation.expirationDate
            }
        });
        return result.modifiedCount === 1;
    },
    async deleteUserById(_id: ObjectId): Promise<boolean> {
        const result = await userCollection.deleteOne({_id});
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<void> {
        const result = await userCollection.deleteMany({});
    },
}

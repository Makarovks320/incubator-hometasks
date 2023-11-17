import {ObjectId} from "mongodb";
import {EmailConfirmationType, UserDBModel, UserModel} from "../models/user/user-db-model";

export class UsersRepository {
    async createUser(user: UserDBModel): Promise<UserDBModel> {
        await UserModel.insertMany(user);
        return user;
    }
    async addPassRecoveryCode(_id: ObjectId, passwordRecoveryCode: string): Promise<boolean> {
        const result = await UserModel.updateOne({_id: _id}, {
            $set: {
                'passwordRecovery.passwordRecoveryCode': passwordRecoveryCode,
                'passwordRecoveryCode.active': true
            }
        });
        return result.modifiedCount === 1;
    }
    async confirmUserById(_id: ObjectId): Promise<boolean> {
        const result = await UserModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    }
    async getUserById(id: ObjectId): Promise<UserDBModel | null> {
        const user = await UserModel.findOne({_id: id});
        return user ? user : null;
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await UserModel.findOne({$or: [{'accountData.userName': loginOrEmail}, {'accountData.email': loginOrEmail}]});
        return user ? user : null;
    }
    async findUserByConfirmationCodeOrEmail(codeOrEmail: string): Promise<UserDBModel | null> {
        const user = await UserModel.findOne({$or: [{'emailConfirmation.confirmationCode': codeOrEmail}, {'accountData.email': codeOrEmail}]});
        return user;
    }
    async updateConfirmationCode(_id: ObjectId, emailConfirmation: EmailConfirmationType): Promise<boolean> {
        const result = await UserModel.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': emailConfirmation.confirmationCode,
                'emailConfirmation.expirationDate': emailConfirmation.expirationDate
            }
        });
        return result.modifiedCount === 1;
    }
    async updatePassword(newPasswordHash: string, userId: ObjectId): Promise<boolean> {
        const result = await UserModel.updateOne({'_id': userId}, {
            $set: {
                "accountData.hash": newPasswordHash,
                "passwordRecovery.active": false
            }
        });
        return result.modifiedCount === 1
    }
    async deleteUserById(_id: ObjectId): Promise<boolean> {
        const result = await UserModel.deleteOne({_id});
        return result.deletedCount === 1
    }
    async deleteAllUsers(): Promise<void> {
        const result = await UserModel.deleteMany({});
    }
}


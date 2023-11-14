import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class UserDBModel {
    constructor(
        public _id: ObjectId,
        public accountData: AccountDataType,
        public emailConfirmation: EmailConfirmationType,
        public passwordRecovery: PasswordRecoveryType
    ) { }
}

type AccountDataType = {
    userName: string;
    email: string;
    salt: string;
    hash: string;
    createdAt: string;
};
export type EmailConfirmationType = {
    confirmationCode: string;
    isConfirmed: boolean;
    expirationDate: Date;
};
type PasswordRecoveryType = {
    passwordRecoveryCode: string,
    active: false
}

export const userMongoSchema = new mongoose.Schema<UserDBModel>({
    accountData: {
        userName: {type: String, required: true},
        email: {type: String, required: true},
        salt: {type: String, required: true},
        hash: {type: String, required: true},
        createdAt: {type: String, required: true},
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        isConfirmed: {type: Boolean, required: true},
        expirationDate: {type: Date, required: true}
    },
    passwordRecovery: {
        passwordRecoveryCode: {type: String, required: false},
        active: {type: Boolean, required: true}
    }
})

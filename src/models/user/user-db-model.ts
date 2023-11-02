import {ObjectId} from "mongodb";

export type UserDBModel = {
    _id: ObjectId,
    accountData: {
        userName: string;
        email: string;
        salt: string;
        hash: string;
        createdAt: string;
    },
    emailConfirmation: EmailConfirmationType
}

export type EmailConfirmationType = {
    confirmationCode: string;
    isConfirmed: boolean;
    expirationDate: Date;
}


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

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersWithPaginationModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}
export type UserAuthMeViewModel = {
    email: string,
    login: string,
    userId: string//todo проверить где юзался
}

export type EmailConfirmationType = {
    confirmationCode: string;
    isConfirmed: boolean;
    expirationDate: Date;
}

export type UsersQueryParams = {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

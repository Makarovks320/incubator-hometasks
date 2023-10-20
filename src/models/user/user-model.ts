import {ObjectId} from "mongodb";

export type InputUser = {
    login: string,
    email: string,
    password: string
}
export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}
export type OutputUser = {
    _id: ObjectId,
    accountData: {
        userName: string,
        email: string,
        createdAt: string
    }
}
export type UsersWithPaginationModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputUser[]
}
export type UsersQueryParams = {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

import {Request} from "express";
import {UsersQueryParams} from "./user/user-model";

export function getQueryParamsForUsers(req: Request): UsersQueryParams {
    return {
        searchLoginTerm: req.query.searchLoginTerm as string || null,
        searchEmailTerm: req.query.searchEmailTerm as string || null,
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}

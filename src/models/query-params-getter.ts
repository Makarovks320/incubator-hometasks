import {Request} from "express";
import {UsersQueryParams} from "./user/users-query-params";

export function getQueryParamsForUsers(req: Request): UsersQueryParams {
    return new UsersQueryParams (
        parseInt(req.query.pageNumber as string) || 1,
        parseInt(req.query.pageSize as string) || 10,
        req.query.sortBy as string || 'createdAt',
        req.query.sortDirection === 'asc' ? 'asc' : 'desc',
        req.query.searchLoginTerm as string || null,
        req.query.searchEmailTerm as string || null
    )
}

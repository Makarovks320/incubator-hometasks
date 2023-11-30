import {Request} from "express";
import {PostQueryParams} from "../models/post/post-query-params-type";
import {BlogQueryParams} from "../models/blog/blog-query-params-type";

export function getPostQueryParams (req: Request): PostQueryParams {
    return new PostQueryParams(
        parseInt(req.query.pageNumber as string) || 1,
        parseInt(req.query.pageSize as string) || 10,
        req.query.sortBy as string || 'createdAt',
        req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    )
}
export function getBlogQueryParams (req: Request): BlogQueryParams {
    return new BlogQueryParams(
        parseInt(req.query.pageNumber as string) || 1,
        parseInt(req.query.pageSize as string) || 10,
        req.query.sortBy as string || 'createdAt',
        req.query.sortDirection === 'asc' ? 'asc' : 'desc',
        req.query.searchNameTerm as string || null
    )
}

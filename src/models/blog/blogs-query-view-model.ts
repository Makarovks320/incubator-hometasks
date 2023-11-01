import {BlogViewModel} from "./blog-view-model";

export type BlogsQueryViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}

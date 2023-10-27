import {blogCollection, DEFAULT_PROJECTION} from "../../db/db";
import {Blog} from "../blogs-repository";
import {Filter, Sort} from "mongodb";

export type BlogQueryParams = {
    searchNameTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

type BlogsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Blog[]
}

export const blogsQueryRepository = {
    async getBlogs(queryParams: BlogQueryParams): Promise<BlogsOutput> {

        const filter: Filter<Blog> = {};
        if (queryParams.searchNameTerm) {
            filter.name = {$regex: queryParams.searchNameTerm, $options: 'i'};
        }

        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }

        const res = await blogCollection.find(filter, { projection: DEFAULT_PROJECTION})
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
        const totalCount = await blogCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
};

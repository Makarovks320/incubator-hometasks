import {blogCollection, DEFAULT_PROJECTION} from "../../db/db";
import {Filter, Sort} from "mongodb";
import {BlogQueryParams} from "../../models/blog/blog-query-params-type";
import {BlogsQueryViewModel} from "../../models/blog/blogs-query-view-model";
import {BlogViewModel} from "../../models/blog/blog-view-model";

export const blogsQueryRepository = {
    async getBlogs(queryParams: BlogQueryParams): Promise<BlogsQueryViewModel> {

        const filter: Filter<BlogViewModel> = {};
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

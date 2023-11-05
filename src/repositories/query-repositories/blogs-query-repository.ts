import {BlogModel, DEFAULT_MONGOOSE_PROJECTION, DEFAULT_PROJECTION} from "../../db/db";
import {BlogQueryParams} from "../../models/blog/blog-query-params-type";
import {BlogsWithPaginationModel} from "../../models/blog/blogs-with-pagination-model";
import {BlogViewModel} from "../../models/blog/blog-view-model";
import mongoose from "mongoose";

export const blogsQueryRepository = {
    async getBlogs(queryParams: BlogQueryParams): Promise<BlogsWithPaginationModel> {

        const filter: mongoose.FilterQuery<BlogViewModel> = {};
        if (queryParams.searchNameTerm) {
            filter.name = {$regex: queryParams.searchNameTerm, $options: 'i'};
        }

        let sort: any;//todo: как типизировать?
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }

        const res = await BlogModel
            .find(filter, { projection: DEFAULT_PROJECTION})
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean()
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize);

        const totalCount = await BlogModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
};

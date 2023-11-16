import {DEFAULT_MONGOOSE_PROJECTION} from "../../db/db";
import {PostQueryParams} from "../../models/post/post-query-params-type";
import {PostsWithPaginationModel} from "../../models/post/posts-with-pagination-model";
import {PostDBModel, PostModel} from "../../models/post/post-db-model";
import mongoose from "mongoose";

export class PostsQueryRepository {
    async getPosts(queryParams: PostQueryParams, blogId?: string): Promise<PostsWithPaginationModel> {
        const filter: mongoose.FilterQuery<PostDBModel> = {};
        if (blogId) {
            filter.blogId = blogId;
        }
        const sort: Record<string, 1 | -1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const res = await PostModel.find(filter)
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean()
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize);

        const totalCount = await PostModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
}

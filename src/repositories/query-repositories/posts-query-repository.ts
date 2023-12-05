import {WITHOUT_v_MONGOOSE_PROJECTION} from "../../db/db";
import {PostQueryParams} from "../../models/post/post-query-params-type";
import {PostsWithPaginationModel} from "../../models/post/posts-with-pagination-model";
import {PostDBType, PostModel} from "../../models/post/post-db-model";
import mongoose from "mongoose";
import {injectable} from "inversify";
import {getPostViewModel} from "../../helpers/post-view-model-mapper";

@injectable()
export class PostsQueryRepository {
    async getPosts(queryParams: PostQueryParams, blogId?: string): Promise<PostsWithPaginationModel> {
        const filter: mongoose.FilterQuery<PostDBType> = {};
        if (blogId) {
            filter.blogId = blogId;
        }
        const sort: Record<string, 1 | -1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const posts: PostDBType[] = await PostModel.find(filter)
            .select(WITHOUT_v_MONGOOSE_PROJECTION)
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
            items: posts.map(p => getPostViewModel(p))
        }
    }
}

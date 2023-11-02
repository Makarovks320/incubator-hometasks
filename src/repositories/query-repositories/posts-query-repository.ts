import {DEFAULT_PROJECTION, postCollection} from "../../db/db";
import {Filter, Sort} from "mongodb";
import {PostQueryParams} from "../../models/post/post-query-params-type";
import {Post} from "../../models/post/post-view-model";
import {PostsQueryViewModel} from "../../models/post/posts-query-view-model";

export const postsQueryRepository = {
    async getPosts(queryParams: PostQueryParams, blogId?: string): Promise<PostsQueryViewModel> {
        const filter: Filter<Post> = {}
        if (blogId) {
            filter.blogId = blogId;
        }
        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const res = await postCollection.find(filter, {projection: DEFAULT_PROJECTION})
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
}

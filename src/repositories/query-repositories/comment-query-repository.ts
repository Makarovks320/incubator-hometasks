import {DEFAULT_MONGOOSE_PROJECTION} from "../../db/db";
import {CommentViewModel} from "../../models/comment/comment-view-model";
import {CommentModel} from "../../models/comment/comment-db-model";
type commentQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}
export const COMMENT_PROJECTION = {...DEFAULT_MONGOOSE_PROJECTION, postId: false}

type CommentsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentViewModel[]
}

export const commentQueryRepository = {
    async getCommentsForPost(postId: string, queryParams: commentQueryParams): Promise<CommentsOutput> {

        const sort: Record<string, -1 | 1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const res = await CommentModel.find({postId})
            .select(COMMENT_PROJECTION)
            .lean()
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
        const totalCount = await CommentModel.countDocuments({postId});

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
}

import {commentCollection, DEFAULT_PROJECTION} from "./db";
import {Sort} from "mongodb";
import {CommentOutput} from "./commentsRepository";
type commentQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}
export const COMMENT_PROJECTION = {...DEFAULT_PROJECTION, postId: false}

type CommentsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentOutput[]
}

export const commentQueryRepository = {
    async getCommentsForPost(postId: string, queryParams: commentQueryParams): Promise<CommentsOutput> {

        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const res = await commentCollection.find({postId}, {projection: COMMENT_PROJECTION})
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();
        const totalCount = await commentCollection.countDocuments({postId});

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
}

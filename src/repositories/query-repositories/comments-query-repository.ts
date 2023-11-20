import {WITHOUT_v_MONGOOSE_PROJECTION} from "../../db/db";
import {CommentDBModel, CommentModel} from "../../models/comment/comment-db-model";
import {WithPagination} from "../../models/common-types-aliases-&-generics/with-pagination-type";
import {ObjectId} from "mongodb";
type commentQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}
export const COMMENT_PROJECTION = {...WITHOUT_v_MONGOOSE_PROJECTION, postId: false}


export class CommentsQueryRepository {
    async getCommentsForPost(postId: string, queryParams: commentQueryParams): Promise<WithPagination<CommentDBModel>> {

        const sort: Record<string, -1 | 1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const foundComments = await CommentModel.find({postId})
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
            items: foundComments
        }
    }

    async getCommentById(_id: ObjectId): Promise<CommentDBModel | null> {
        return CommentModel.findOne({_id})
            .select(COMMENT_PROJECTION)
            .lean();
    }
}

import {WITHOUT_v_MONGOOSE_PROJECTION} from "../../db/db";
import {CommentModel} from "../../models/comment/comment-db-model";
import {WithPagination} from "../../models/common-types-aliases-&-generics/with-pagination-type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentDbType} from "../../models/comment/comment-types";
import {CommentViewModel} from "../../models/comment/comment-view-model";
import {getCommentViewModel} from "../../helpers/comment-view-model-mapper";
type commentQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}
export const COMMENT_PROJECTION = {...WITHOUT_v_MONGOOSE_PROJECTION, postId: false}

@injectable()
export class CommentsQueryRepository {
    async getCommentsForPost(postId: string, queryParams: commentQueryParams, userId: ObjectId): Promise<WithPagination<CommentViewModel>> {

        const sort: Record<string, -1 | 1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const foundComments: CommentDbType[] = await CommentModel.find({postId})
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
            items: foundComments.map( c => getCommentViewModel(c, userId))
        }
    }

    async getCommentById(_id: ObjectId): Promise<CommentDbType | null> {
        return CommentModel.findOne({_id})
            .select(COMMENT_PROJECTION)
            .lean();
    }

    async getCommentViewModel(commentId: ObjectId, userId: ObjectId): Promise<CommentViewModel | null> {
        const commentFromDb = await CommentModel.findOne({_id: commentId})
            .select(COMMENT_PROJECTION)
            .lean();
        if (!commentFromDb) return null;
        return getCommentViewModel(commentFromDb, userId);
    }
}

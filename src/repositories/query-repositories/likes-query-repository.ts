import {WITHOUT_v_MONGOOSE_PROJECTION} from "../../db/db";
import {CommentDBModel, CommentModel} from "../../models/comment/comment-db-model";
import {WithPagination} from "../../models/common-types-aliases-&-generics/with-pagination-type";
import {ObjectId} from "mongodb";
import {LikeDbModel, LikeModel, likesCountInfo} from "../../models/like/like-db-model";
type commentQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}
export const COMMENT_PROJECTION = {...WITHOUT_v_MONGOOSE_PROJECTION, postId: false}


export class LikesQueryRepository {

    async getLikesAndDislikesCountForComment(comment_id: ObjectId): Promise<likesCountInfo> {
        try {
            const likesCount = await LikeModel.countDocuments({ comment_id, type: 'Like' });
            const dislikesCount = await LikeModel.countDocuments({ comment_id, type: 'Dislike' });

            return { likes: likesCount, dislikes: dislikesCount };
        } catch (error) {
            console.error('Error while getting likes count:', error);
            throw error;
        }
    }
    async getLikeForCommentForCurrentUser(comment_id: ObjectId, user_id: ObjectId): Promise<LikeDbModel | null> {
        return LikeModel.findOne({ comment_id, user_id }).lean();
    }
}

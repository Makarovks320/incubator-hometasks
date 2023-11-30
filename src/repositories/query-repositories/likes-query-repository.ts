import {CommentDBModel} from "../../models/comment/comment-db-model";
import {ObjectId} from "mongodb";
import {
    LikeDbModel,
    LikeModel,
    likesCountInfo,
    LIKE_STATUS_DB_ENUM,
    LikeStatusType, PARENT_TYPE_ENUM, PARENT_TYPE_DB_ENUM
} from "../../models/like/like-db-model";
import {CommentViewModel, LikesInfo} from "../../models/comment/comment-view-model";
import {convertDbEnumToLikeStatus} from "../../helpers/like-status-converters";
import {getCommentViewModel} from "../../helpers/comment-view-model-mapper";
import {WithPagination} from "../../models/common-types-aliases-&-generics/with-pagination-type";
import {injectable} from "inversify";

@injectable()
export class LikesQueryRepository {

    private async getLikesAndDislikesCountForComment(parentId: ObjectId): Promise<likesCountInfo> {
        try {
            const likesCount = await LikeModel.countDocuments({ parent_id: parentId, type: LIKE_STATUS_DB_ENUM.LIKE }).lean();
            const dislikesCount = await LikeModel.countDocuments({ parent_id: parentId, type: LIKE_STATUS_DB_ENUM.DISLIKE }).lean();

            return { likesCount: likesCount, dislikesCount: dislikesCount };
        } catch (error) {
            console.error('Error while getting likes count:', error);
            throw error;
        }
    }
    async getLikeForParentForCurrentUser(parent_id: ObjectId, user_id: ObjectId): Promise<LikeDbModel | null> {
        return LikeModel.findOne({ parent_id, user_id }).lean();
    }

    async getLikesInfo(parentId: ObjectId, userId: ObjectId): Promise<LikesInfo> {
        const likesCountInfo: likesCountInfo = await this.getLikesAndDislikesCountForComment(parentId);
        const myLike: LikeDbModel | null = await this.getLikeForParentForCurrentUser(parentId, userId);
        let myStatus: LikeStatusType = 'None';
        if (myLike) {
            myStatus = convertDbEnumToLikeStatus(myLike!.type);
        }
        const likesInfo: LikesInfo = {...likesCountInfo, myStatus};
        return likesInfo;
    }

    async findLikesForManyComments(comments: WithPagination<CommentDBModel>, currentUserId: ObjectId): Promise<WithPagination<CommentViewModel>> {
        //todo: здесь ходить за лайками, а не брать из параметров
        const viewCommentsWithLikesInfoPromises: Promise<CommentViewModel>[] = comments.items.map(async c => {
            const likesCountInfo: likesCountInfo = await this.getLikesAndDislikesCountForComment(c._id);
            // todo: Promise.all
            // достать все лайки для каждого коммента - ?
            // при создании сохранять в коллекцию комментов общее количетво лайков и дизлайков
            const like: LikeDbModel | null = await this.getLikeForParentForCurrentUser(c._id, currentUserId);
            const result = getCommentViewModel(c, {
                likesCount: likesCountInfo.likesCount,
                dislikesCount: likesCountInfo.dislikesCount,
                myStatus: like ? convertDbEnumToLikeStatus(like.type) : 'None'
            })
            return result;
        });

        const commentsWithLikes: CommentViewModel[] = await Promise.all(viewCommentsWithLikesInfoPromises);
        return {
            pagesCount: comments.pagesCount,
            page: comments.page,
            pageSize: comments.pageSize,
            totalCount: comments.totalCount,
            items: commentsWithLikes
        }
    }
}

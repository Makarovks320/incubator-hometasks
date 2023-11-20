import {ObjectId} from "mongodb";
import {LikeDbModel, likesCountInfo, LikeStatusType} from "../models/like/like-db-model";
import {LikesRepository} from "../repositories/likes-repository";
import {convertLikeStatusToDbEnum} from "../helpers/like-status-converters";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";


export class LikeService {
    constructor(
        protected likesRepository: LikesRepository,
        protected likesQueryRepository: LikesQueryRepository
    ) {
    }

    async createNewLike(commentId: ObjectId, userId: ObjectId, likeStatus: LikeStatusType): Promise<LikeDbModel | string> {
        const like: LikeDbModel = {
            _id: new ObjectId(),
            comment_id: commentId,
            type: convertLikeStatusToDbEnum(likeStatus),
            user_id: userId,
            createdAt: new Date(),
            updatedAt: null
        }
        return await this.likesRepository.createNewLike(like);
    }

    async getLikesAndDislikesCountForComment(commentId: ObjectId): Promise<likesCountInfo> {
        return await this.likesQueryRepository.getLikesAndDislikesCountForComment(commentId);
    }

    async getLikeForCommentForCurrentUser(commentId: ObjectId, userId: ObjectId): Promise<LikeDbModel | null> {
        return await this.likesQueryRepository.getLikeForCommentForCurrentUser(commentId, userId);
    }

    async changeLikeStatus(currentLike: LikeDbModel, updateLikeStatus: LikeStatusType): Promise<boolean> {
        const like: LikeDbModel = {
            ...currentLike,
            type: convertLikeStatusToDbEnum(updateLikeStatus),
            updatedAt: new Date()
        }
        return await this.likesRepository.updateLike(like);
    }
    // async updateLikeStatus(comment: InputComment, commentId: string): Promise<boolean> {
    //     //запросим существующий коммент, чтобы получить postId:
    //     const commentObjectId: ObjectId = stringToObjectIdMapper(commentId);
    //     const currentComment: CommentDBModel | null = await this.commentsRepository.getCommentByIdWithPostId(commentObjectId);
    //     if (!currentComment) {
    //         throw new Error('comment is not found');
    //         return false;
    //     }
    //

    //
    // async deleteAllLikes(): Promise<void> {
    //     await this.commentsRepository.deleteAllBlogs();
    // }


}


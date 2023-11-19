import {ObjectId} from "mongodb";
import {LikeDbModel, LikeStatusDbEnum, LikeStatusType} from "../models/like/like-db-model";
import {LikesRepository} from "../repositories/likes-repository";


export class LikeService {
    constructor(
        protected likesRepository: LikesRepository
    ) {
    }

    async createNewLike(commentId: ObjectId, userId: ObjectId, likeStatus: LikeStatusType): Promise<LikeDbModel | string> {

        const like: LikeDbModel = {
            _id: new ObjectId(),
            comment_id: commentId,
            type: this.convertLikeStatusToDbEnum(likeStatus),
            user_id: userId,
            createdAt: new Date()
        }
        return await this.likesRepository.createNewLike(like);
    }

    // async updateLikeStatus(comment: InputComment, commentId: string): Promise<boolean> {
    //     //запросим существующий коммент, чтобы получить postId:
    //     const commentObjectId: ObjectId = new mongoose.Types.ObjectId(commentId);
    //     const currentComment: CommentDBModel | null = await this.commentsRepository.getCommentByIdWithPostId(commentObjectId);
    //     if (!currentComment) {
    //         throw new Error('comment is not found');
    //         return false;
    //     }
    //
    // async getLikesForComment(id: string): Promise<CommentDBModel | null> {
    //     const commentObjectId: ObjectId = new mongoose.Types.ObjectId(id);
    //     return await this.commentsRepository.getCommentById(commentObjectId);
    // }
    //
    // async deleteAllLikes(): Promise<void> {
    //     await this.commentsRepository.deleteAllBlogs();
    // }

    //todo: убрать в утилиты
    private convertLikeStatusToDbEnum(likeStatus: LikeStatusType): LikeStatusDbEnum {
        switch (likeStatus) {
            case 'Like':
                return LikeStatusDbEnum.LIKE;
            case 'Dislike':
                return LikeStatusDbEnum.DISLIKE;
            case 'None':
                return LikeStatusDbEnum.NONE;
            default:
                throw new Error('Invalid LikeStatusType');
        }
    }

    private convertDbEnumToLikeStatus(dbEnumValue: LikeStatusDbEnum): LikeStatusType {
        switch (dbEnumValue) {
            case LikeStatusDbEnum.LIKE:
                return 'Like';
            case LikeStatusDbEnum.DISLIKE:
                return 'Dislike';
            case LikeStatusDbEnum.NONE:
                return 'None';
            default:
                throw new Error('Invalid LikeStatusDbEnum');
        }
    }
}

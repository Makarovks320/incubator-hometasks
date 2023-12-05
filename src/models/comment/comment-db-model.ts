import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {LIKE_STATUS_DB_ENUM, LIKE_STATUS_ENUM, LikeStatusType} from "../like/like-db-model";
import {
    CommentDbType,
    CommentDocument,
    CommentMethodsType,
    CommentModelFullType,
    CreateCommentDto,
    dbLikesInfoType,
    likeForComment
} from "./comment-types";
import {convertLikeStatusToDbEnum} from "../../helpers/like-status-converters";


// Схемы:
const likeForCommentSchema = new mongoose.Schema<likeForComment>({
    userId: {type: mongoose.Types.ObjectId, required: true},
    likeStatus: {type: Number, enum: [LIKE_STATUS_DB_ENUM.LIKE, LIKE_STATUS_DB_ENUM.DISLIKE, LIKE_STATUS_DB_ENUM.NONE], required: true},
})

const dbLikesInfoSchema = new mongoose.Schema<dbLikesInfoType>({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    likes: [{type: likeForCommentSchema, required: true, default: []}]
})

const commentSchema = new mongoose.Schema<CommentDbType, CommentModelFullType, CommentMethodsType>({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: ObjectId,
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    dbLikesInfo: {type: dbLikesInfoSchema}
})

export const commentStatics: any = {
    createComment(dto: CreateCommentDto): CommentDocument {
            const comment: CommentDbType = {
                _id: dto._id,
                postId: dto.postId,
                content: dto.content,
                commentatorInfo: {
                    userId: dto.userId,
                    userLogin: dto.userLogin
                },
                createdAt: (new Date()).toISOString(),
                dbLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    likes: []
                }
            }
            return new CommentModel(comment);
    }

}
export const commentMethods = {
    _findLikeForUser(userId: ObjectId): likeForComment | undefined {
        const that = this as CommentDbType & CommentMethodsType;
        return that.dbLikesInfo.likes.find(l => l.userId.equals(userId));
    },
    _createNewLike(likeStatus: LikeStatusType, userId: ObjectId) {
        const that = this as CommentDbType & CommentMethodsType;
        const reaction: likeForComment = {
            userId,
            likeStatus: convertLikeStatusToDbEnum(likeStatus)
        };
        // @ts-ignore
        that.dbLikesInfo.likes.push(reaction);
        switch (likeStatus) {
            case LIKE_STATUS_ENUM.LIKE :
                that.dbLikesInfo.likesCount++;
                break;
            case LIKE_STATUS_ENUM.DISLIKE :
                that.dbLikesInfo.dislikesCount++;
                break;
        }
    },
    _changeLike(likeForComment: likeForComment, likeStatus: LIKE_STATUS_DB_ENUM) {
        const that = this as CommentDbType & CommentMethodsType;
        // если нет смысла менять
        if (likeForComment.likeStatus === likeStatus) return;

        //уменьшаем количество лайков или дизлайков
        if (likeForComment.likeStatus === LIKE_STATUS_DB_ENUM.LIKE) that.dbLikesInfo.likesCount--;
        if (likeForComment.likeStatus === LIKE_STATUS_DB_ENUM.DISLIKE) that.dbLikesInfo.dislikesCount--;
        // увеличиваем количество лайков или дизлайков
        if (likeStatus === LIKE_STATUS_DB_ENUM.LIKE) that.dbLikesInfo.likesCount++;
        if (likeStatus === LIKE_STATUS_DB_ENUM.DISLIKE) that.dbLikesInfo.dislikesCount++;

        // меняем статус лайка
        likeForComment.likeStatus = likeStatus;
    },
    updateContent(userId: ObjectId, content: string) {
        const that = this as CommentDbType & CommentMethodsType;
        if (that.commentatorInfo.userId.toString() != userId.toString()) {
            throw new Error('Comment does not below to the user');
        }
        that.content = content;
    },
    changeLikeStatusForComment(likeStatus: LikeStatusType, userId: ObjectId) {
        const that = this as CommentDbType & CommentMethodsType;
        // если у коммента есть лайк от текущего пользователя, то изменим его, если нет - создадим
        const currentLike = that._findLikeForUser(userId);
        if (!currentLike) {
            that._createNewLike(likeStatus, userId);
            return;
        }
        that._changeLike(currentLike!, convertLikeStatusToDbEnum(likeStatus));
    },
}

commentSchema.methods = commentMethods;
commentSchema.statics = commentStatics;
export const CommentModel = mongoose.model<CommentDbType, CommentModelFullType>('comments', commentSchema);

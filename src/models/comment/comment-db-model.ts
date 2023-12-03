import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {LIKE_STATUS_DB_ENUM} from "../like/like-db-model";
import {
    CommentDbType, CommentDocument,
    CommentMethodsType,
    CommentModelFullType,
    CreateCommentDto,
    dbLikesInfoType,
    likeForComment
} from "./comment-types";


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
    },


}
export const commentMethods = {}

commentSchema.methods = commentMethods;
commentSchema.statics = commentStatics;
export const CommentModel = mongoose.model<CommentDbType, CommentModelFullType>('comments', commentSchema);

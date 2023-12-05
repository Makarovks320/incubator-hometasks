import {CommentViewModel} from "../models/comment/comment-view-model";
import {CommentDbType} from "../models/comment/comment-types";
import {LIKE_STATUS_ENUM, LikeStatusType} from "../models/like/like-db-model";
import {ObjectId} from "mongodb";
import {convertDbEnumToLikeStatus} from "./like-status-converters";

export const getCommentViewModel = (commentDb: CommentDbType, userId: ObjectId | null = null): CommentViewModel => {
    let myStatus: LikeStatusType = LIKE_STATUS_ENUM.NONE;
    if (userId) {
        const myLike = commentDb.dbLikesInfo.likes.find(l => l.userId.equals(userId));
        if (myLike) myStatus = convertDbEnumToLikeStatus(myLike.likeStatus);
    }
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
        commentatorInfo: commentDb.commentatorInfo,
        createdAt: commentDb.createdAt,
        likesInfo: {
            likesCount: commentDb.dbLikesInfo.likesCount,
            dislikesCount: commentDb.dbLikesInfo.dislikesCount,
            myStatus: myStatus
        }
    }
}

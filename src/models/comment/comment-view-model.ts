import {ObjectId} from "mongodb";
import {LikeStatusType} from "../like/like-db-model";

export type CommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string
    },
    createdAt: string,
    likesInfo: LikesInfo
}

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType
}
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";
import {CommentDbType} from "../models/comment/comment-types";

export const getCommentViewModel = (commentDb: CommentDbType,
                                    likesInfo: LikesInfo = {
                                        likesCount: 0,
                                        dislikesCount: 0,
                                        myStatus: "None"
                                    }): CommentViewModel => {
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
        commentatorInfo: commentDb.commentatorInfo,
        createdAt: commentDb.createdAt,
        likesInfo
    }
}

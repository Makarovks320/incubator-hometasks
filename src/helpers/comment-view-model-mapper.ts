import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";

export const getCommentViewModel = (commentDb: CommentDBModel,
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

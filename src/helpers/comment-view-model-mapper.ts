import { CommentDBModel } from "../models/comment/comment-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";

export const getCommentViewModel = (commentDb: CommentDBModel): CommentViewModel => {
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
        commentatorInfo: commentDb.commentatorInfo,
        createdAt: commentDb.createdAt
    }
}

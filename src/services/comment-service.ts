import {commentsRepository} from "../repositories/comments-repository";
import { userService } from "../composition-root";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";

export type InputCommentWithPostId = {
    content: string,
    postId: string
}
export type InputComment = {
    content: string
}

export const commentService = {
    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentDBModel | string> {
        // найдем userLogin
        const user: UserDBModel | null = await userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const comment: CommentDBModel = {
            id: new Date().valueOf().toString(),
            postId: c.postId,
            content: c.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.accountData.userName
            },
            createdAt: (new Date()).toISOString()
        }
        return await commentsRepository.createNewComment(comment);
    },

    async updateComment(c: InputComment, commentId: string): Promise<boolean> {
        //запросим существующий коммент, чтобы получить postId:
        const currentComment: CommentDBModel | null = await commentsRepository.getCommentByIdWithPostId(commentId);
        if (!currentComment) {
                throw new Error('comment is not found');
                return false;
            }

        const updatedComment: CommentDBModel = {
            id: commentId,
            postId: currentComment!.postId,
            content: c.content,
            commentatorInfo: currentComment.commentatorInfo,
            createdAt: currentComment.createdAt
        }
        const isUpdated = await commentsRepository.updateComment(commentId, updatedComment);

        return !!isUpdated;
    },

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return await commentsRepository.getCommentById(id);
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id);
    },
    async deleteAllComments(): Promise<void> {
        await commentsRepository.deleteAllBlogs();
    },
}

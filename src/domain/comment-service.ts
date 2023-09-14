import {Comment, CommentOutput, commentsRepository} from "../Repositories/comments-repository";
import { OutputUser, userService } from "./user-service";
import {ObjectId} from "mongodb";

export type InputCommentWithPostId = {
    content: string,
    postId: string
}
export type InputComment = {
    content: string
}

export const commentService = {
    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentOutput> {
        // найдем userLogin
        const user: OutputUser | null = await userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const comment: Comment = {
            id: new Date().valueOf().toString(),
            postId: c.postId,
            content: c.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.userName
            },
            createdAt: (new Date()).toISOString()
        }
        return await commentsRepository.createNewComment(comment);
    },

    async updateComment(c: InputComment, commentId: string): Promise<boolean> {
        //запросим существующий коммент, чтобы получить postId:
        const currentComment: Comment | null = await commentsRepository.getCommentByIdWithPostId(commentId);
        if (!currentComment) {
                throw new Error('comment is not found');
                return false;
            }

        const updatedComment: Comment = {
            id: commentId,
            postId: currentComment!.postId,
            content: c.content,
            commentatorInfo: currentComment.commentatorInfo,
            createdAt: currentComment.createdAt
        }
        const isUpdated = await commentsRepository.updateComment(commentId, updatedComment);

        return !!isUpdated;
    },

    async getCommentById(id: string): Promise<CommentOutput | null> {
        return await commentsRepository.getCommentById(id);
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id);
    },
    async deleteAllComments(): Promise<void> {
        await commentsRepository.deleteAllBlogs();
    },
}

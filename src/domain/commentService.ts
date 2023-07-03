import {Comment, CommentOutput, commentsRepository} from "../Repositories/commentsRepository";
import { OutputUser, userService } from "./userService";

export type InputComment = {
    content: string,
    postId: string
}

export const commentService = {
    async createNewComment(c: InputComment, userId: string): Promise<CommentOutput> {
        // найдем userLogin
        const user: OutputUser | null = await userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const comment: Comment = {
            id: new Date().valueOf().toString(),
            postId: c.postId,
            content: c.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: (new Date()).toISOString()
        }
        return await commentsRepository.createNewComment(comment);
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

import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";
import {UserService} from "./user-service";

export type InputCommentWithPostId = {
    content: string,
    postId: string
}
export type InputComment = {
    content: string
}

export class CommentService {
    constructor(
        protected commentsRepository: CommentsRepository,
        protected userService: UserService
    ) {
    }

    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentDBModel | string> {
        // найдем userLogin
        const user: UserDBModel | null = await this.userService.findUserById(userId);
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
        return await this.commentsRepository.createNewComment(comment);
    }

    async updateComment(c: InputComment, commentId: string): Promise<boolean> {
        //запросим существующий коммент, чтобы получить postId:
        const currentComment: CommentDBModel | null = await this.commentsRepository.getCommentByIdWithPostId(commentId);
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
        const isUpdated = await this.commentsRepository.updateComment(commentId, updatedComment);

        return !!isUpdated;
    }

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return await this.commentsRepository.getCommentById(id);
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return this.commentsRepository.deleteCommentById(id);
    }

    async deleteAllComments(): Promise<void> {
        await this.commentsRepository.deleteAllBlogs();
    }
}

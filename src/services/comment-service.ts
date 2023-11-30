import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {UserService} from "./user-service";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {inject, injectable} from "inversify";

export type InputCommentWithPostId = {
    content: string,
    postId: string
}
export type InputComment = {
    content: string
}

@injectable()
export class CommentService {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(UserService) private userService: UserService
    ) {
    }

    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentDBModel | string> {
        // найдем userLogin
        const user: UserDBModel | null = await this.userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const comment: CommentDBModel = {
            _id: new ObjectId(),
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

    async updateComment(comment: InputComment, commentId: string): Promise<boolean> {
        //запросим существующий коммент, чтобы получить postId:
        const commentObjectId: ObjectId = stringToObjectIdMapper(commentId);
        const currentComment: CommentDBModel | null = await this.commentsRepository.getCommentByIdWithPostId(commentObjectId);
        if (!currentComment) {
            throw new Error('comment is not found');
            return false;
        }

        const updatedComment: CommentDBModel = {
            _id: commentObjectId,
            postId: currentComment!.postId,
            content: comment.content,
            commentatorInfo: currentComment.commentatorInfo,
            createdAt: currentComment.createdAt
        }
        const isUpdated = await this.commentsRepository.updateComment(commentObjectId, updatedComment);

        return !!isUpdated;
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const commentObjectId: ObjectId = stringToObjectIdMapper(id);
        return this.commentsRepository.deleteCommentById(commentObjectId);
    }
}

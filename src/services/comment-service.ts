import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentModel} from "../models/comment/comment-db-model";
import {UserService} from "./user-service";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {inject, injectable} from "inversify";
import {CommentDocument, CreateCommentDto} from "../models/comment/comment-types";
import {LikeStatusType} from "../models/like/like-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";

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

    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentDocument> {
        // найдем userLogin
        const user: UserDBModel | null = await this.userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const commentDto: CreateCommentDto = {
            _id: new ObjectId(),
            postId: c.postId,
            content: c.content,
            userId: userId,
            userLogin: user.accountData.userName
        }
        const comment: CommentDocument = await CommentModel.createComment(commentDto);
        await this.commentsRepository.save(comment);
        return comment;
    }

    async updateComment(content: string, commentId: ObjectId, userId: ObjectId): Promise<void> {
        const comment: CommentDocument | null = await this.commentsRepository.findCommentById(commentId);
        comment.updateContent(userId, content);
        await this.commentsRepository.save(comment);
    }

    async changeLikeStatus(commentId: string, likeStatus: LikeStatusType, userId: ObjectId): Promise<void> {
        const comment: CommentDocument | null = await this.commentsRepository.findCommentById(stringToObjectIdMapper(commentId));
        comment.changeLikeStatusForComment(likeStatus, userId);
        await this.commentsRepository.save(comment);
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const commentObjectId: ObjectId = stringToObjectIdMapper(id);
        return this.commentsRepository.deleteCommentById(commentObjectId);
    }
}

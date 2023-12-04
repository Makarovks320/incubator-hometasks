import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentModel} from "../models/comment/comment-db-model";
import {UserService} from "./user-service";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {inject, injectable} from "inversify";
import {CommentDbType, CommentDocument, CreateCommentDto} from "../models/comment/comment-types";

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

    async createNewComment(c: InputCommentWithPostId, userId: ObjectId): Promise<CommentDocument | string> {
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

    async updateComment(content: string, commentId: ObjectId, userId: ObjectId): Promise<boolean> {
        const comment = await CommentModel.findCommentById(commentId);
        comment.updateContent(userId, content);
        await this.commentsRepository.save(comment);
        return true;


        // todo: в коде ниже мы получали подтверждение через <result.modifiedCount === 1> в репозитории. А теперь?
        // CommentModel.updateContent(req.body.content)
        //запросим существующий коммент, чтобы получить postId:
        // const commentObjectId: ObjectId = stringToObjectIdMapper(commentId);
        // const currentComment: CommentDbType | null = await this.commentsRepository.getCommentByIdWithPostId(commentObjectId);
        // if (!currentComment) {
        //     throw new Error('comment is not found');
        //     return false;
        // }
        //
        // const updatedComment: CommentDbType = {
        //     _id: commentObjectId,
        //     postId: currentComment!.postId,
        //     content: comment.content,
        //     commentatorInfo: currentComment.commentatorInfo,
        //     createdAt: currentComment.createdAt,
        //     dbLikesInfo: {
        //         likesCount: 0,
        //         dislikesCount: 0,
        //         likes: []
        //     }
        // }
        // const isUpdated = await this.commentsRepository.updateComment(commentObjectId, updatedComment);
        //
        // return !!isUpdated;
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const commentObjectId: ObjectId = stringToObjectIdMapper(id);
        return this.commentsRepository.deleteCommentById(commentObjectId);
    }
}

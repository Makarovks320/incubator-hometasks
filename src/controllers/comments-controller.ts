import {Request, Response} from "express";
import {CommentService, InputComment} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";
import {UserService} from "../services/user-service";
import {getCommentViewModel} from "../helpers/comment-view-model-mapper";
import {LikeService} from "../services/like-service";
import mongoose from "mongoose";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {inject, injectable} from "inversify";
import {CommentDbType} from "../models/comment/comment-types";
import {CommentModel} from "../models/comment/comment-db-model";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentService) private commentService: CommentService,
        @inject(UserService) private userService: UserService,
        @inject(LikeService) private likeService: LikeService,
        @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository,
        @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async updateComment(req: Request, res: Response) {
        const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
        const result = await this.commentService.updateComment(req.body.content, commentObjectId, req.userId);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send(result);
    }

    async getCommentById(req: Request, res: Response) {
        try {
            const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
            const comment: CommentDbType | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            const likesInfo: LikesInfo = await this.likesQueryRepository.getLikesInfo(comment._id, req.userId);
            const viewComment: CommentViewModel = getCommentViewModel(comment, likesInfo);
            res.send(viewComment);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db Error');
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
        const comment: CommentDbType | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
        const user: UserDBModel | null = await this.userService.findUserById(req.userId!);
        if (!user || comment!.commentatorInfo.userLogin != user.accountData.userName) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
            return;
        } else {
            await this.commentService.deleteCommentById(req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }

    async changeLikeStatus(req: Request, res: Response) {
        try {
            await this.likeService.changeLikeStatus(req.params.id, req.body.likeStatus, req.userId);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db error');
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Something went wrong');
        }
    }
}
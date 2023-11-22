import {Request, Response} from "express";
import {CommentService, InputComment} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";
import {UserService} from "../services/user-service";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {getCommentViewModel} from "../helpers/comment-view-model-mapper";
import {LikeService} from "../services/like-service";
import {LikeDbModel} from "../models/like/like-db-model";
import mongoose from "mongoose";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {inject, injectable} from "inversify";
@injectable()
export class CommentsController {
    constructor(
        @inject(CommentService) private commentService: CommentService,
        @inject(UserService) private userService: UserService,
        @inject(LikeService) private likeService: LikeService,
        @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository,
        @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
    ) {}
    async updateComment(req: Request, res: Response) {
        const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
        const oldComment: CommentDBModel | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
        if (!oldComment) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user: UserDBModel | null = await this.userService.findUserById(req.userId!);
        if (oldComment.commentatorInfo.userLogin != user!.accountData.userName) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
            return;
        }
        const commentForUpdate: InputComment = {
            content: req.body.content,
        }
        const result = await this.commentService.updateComment(commentForUpdate, req.params.id);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send(result);
    }

    async getCommentById(req: Request, res: Response) {
        try {
            const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
            const comment: CommentDBModel | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
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
        const comment: CommentDBModel | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
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
            const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
            const comment: CommentDBModel | null = await this.commentsQueryRepository.getCommentById(commentObjectId);

            // если у текущего пользователя есть лайк для данного коммента, то изменим его, если нет - создадим
            const currentLike: LikeDbModel | null = await this.likesQueryRepository.getLikeForCommentForCurrentUser(comment!._id, req.userId);
            currentLike ?
                await this.likeService.changeLikeStatus(currentLike, req.body.likeStatus)
                : await this.likeService.createNewLike(comment!._id, req.userId, req.body.likeStatus);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db error');
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Something went wrong');
        }
    }
}

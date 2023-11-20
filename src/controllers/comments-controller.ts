import {Request, Response} from "express";
import {CommentService, InputComment} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";
import {UserService} from "../services/user-service";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {getCommentViewModel} from "../helpers/comment-view-model-mapper";
import {LikeService} from "../services/like-service";
import {LikeDbModel, likesCountInfo, LikeStatusType} from "../models/like/like-db-model";
import mongoose from "mongoose";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import {convertDbEnumToLikeStatus} from "../helpers/like-status-converters";

export class CommentsController {
    constructor(
        protected commentService: CommentService,
        protected userService: UserService,
        protected likeService: LikeService,
        protected likeQueryRepository: LikesQueryRepository
    ) {}
    async updateComment(req: Request, res: Response) {
        const oldComment: CommentDBModel | null = await this.commentService.getCommentById(req.params.id);
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
        try {//todo: не многовато ли логики для контроллера?
            const comment: CommentDBModel | null = await this.commentService.getCommentById(req.params.id);//у query запросить
            const likesCountInfo: likesCountInfo = await this.likeQueryRepository.getLikesAndDislikesCountForComment(comment!._id);
            const myLike: LikeDbModel | null = await this.likeQueryRepository.getLikeForCommentForCurrentUser(comment!._id, req.userId);
            let myStatus: LikeStatusType = 'None';
            if (myLike) {
                myStatus = convertDbEnumToLikeStatus(myLike!.type);
            }
            const likesInfo: LikesInfo = {...likesCountInfo, myStatus};
            const viewComment: CommentViewModel = getCommentViewModel(comment!, likesInfo);
            res.send(viewComment);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db Error');
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        const comment: CommentDBModel | null = await this.commentService.getCommentById(req.params.id);
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
            const comment: CommentDBModel | null = await this.commentService.getCommentById(req.params.id);//у query запросить
            const currentLike: LikeDbModel | null = await this.likeService.getLikeForCommentForCurrentUser(comment!._id, req.userId);
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

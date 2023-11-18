import {Request, Response} from "express";
import {CommentService, InputComment} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";
import {UserService} from "../services/user-service";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {getCommentViewModel} from "../helpers/comment-view-model-mapper";

export class CommentsController {
    constructor(
        protected commentService: CommentService,
        protected userService: UserService
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
        const comment = await this.commentService.getCommentById(req.params.id);
        if (!comment) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        res.send(getCommentViewModel(comment!));
    }

    async deleteCommentById(req: Request, res: Response) {
        const comment: CommentDBModel | null = await this.commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user: UserDBModel | null = await this.userService.findUserById(req.userId!);
        if (!user || comment!.commentatorInfo.userLogin != user.accountData.userName) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
            return;
        } else {
            await this.commentService.deleteCommentById(req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }
}

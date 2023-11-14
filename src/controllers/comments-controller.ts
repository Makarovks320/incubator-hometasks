import {Request, Response} from "express";
import {commentService, InputComment} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {userService} from "../composition-root";
import {UserDBModel} from "../models/user/user-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";

export const commentController = {
    async updateComment(req: Request, res: Response) {
        const oldComment: CommentViewModel | null = await commentService.getCommentById(req.params.id);
        if (!oldComment) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user: UserDBModel | null = await userService.findUserById(req.userId!);
        if (oldComment!.commentatorInfo.userLogin != user!.accountData.userName) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
            return;
        }
        const commentForUpdate: InputComment = {
            content: req.body.content,
        }
        const result = await commentService.updateComment(commentForUpdate, req.params.id);
        if (typeof result === 'string') {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send(result);
            return;
        }
        res.status(HTTP_STATUSES.NO_CONTENT_204).send(result);
    },

    async getCommentById(req: Request, res: Response) {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    },

    async deleteCommentById(req: Request, res: Response) {
        const comment: CommentViewModel | null = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user = await userService.findUserById(req.userId!) as UserDBModel;//todo вместо OutputUser UserViewModel
        if (comment!.commentatorInfo.userLogin != user.accountData.userName) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
            return;
        } else {
            await commentService.deleteCommentById(req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }
}

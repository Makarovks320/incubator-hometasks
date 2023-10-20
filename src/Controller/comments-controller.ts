import {Request, Response} from "express";
import {CommentOutput} from "../Repositories/comments-repository";
import {commentService, InputComment} from "../domain/comment-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {userService} from "../domain/user-service";
import {UserViewModel} from "../models/user/user-model";

export const commentController = {
    async updateComment(req: Request, res: Response) {
        const oldComment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!oldComment) {
            res.status(STATUSES_HTTP.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user = await userService.findUserById(req.userId!) as UserViewModel;//todo вместо OutputUser UserViewModel
        if (oldComment!.commentatorInfo.userLogin != user.login) {
            res.status(STATUSES_HTTP.FORBIDDEN_403).send('Comment is not your own');
            return;
        }
        const commentForUpdate: InputComment = {
            content: req.body.content,
        }
        const isUpdated = await commentService.updateComment(commentForUpdate, req.params.id);
        isUpdated ? res.send(STATUSES_HTTP.NO_CONTENT_204) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    },

    async getCommentById(req: Request, res: Response) {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(STATUSES_HTTP.NOT_FOUND_404);
    },

    async deleteCommentById(req: Request, res: Response) {
        const comment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(STATUSES_HTTP.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user = await userService.findUserById(req.userId!) as UserViewModel;//todo вместо OutputUser UserViewModel
        if (comment!.commentatorInfo.userLogin != user.login) {
            res.status(STATUSES_HTTP.FORBIDDEN_403).send('Comment is not your own');
            return;
        } else {
            await commentService.deleteCommentById(req.params.id);
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
        }
    }
}

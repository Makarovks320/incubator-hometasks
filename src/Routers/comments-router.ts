import {Request, Response, Router} from "express";
import {commentService, InputComment} from "../domain/comment-service";
import {CommentOutput} from "../Repositories/comments-repository";
import {authMiddleware} from "../Middlewares/auth-middleware";
import {OutputUser, userService} from "../domain/user-service";
import {commentContentValidation} from "../Middlewares/comment-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {STATUSES_HTTP} from "../enums/http-statuses";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware,
    commentContentValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const oldComment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!oldComment) {
            res.status(STATUSES_HTTP.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user = await userService.findUserById(req.userId!) as OutputUser;
        if (oldComment!.commentatorInfo.userLogin != user.accountData.userName) {
            res.status(STATUSES_HTTP.FORBIDDEN_403).send('Comment is not your own');
            return;
        }
        const commentForUpdate : InputComment = {
            content: req.body.content,
        }
        const isUpdated = await commentService.updateComment(commentForUpdate, req.params.id);
        isUpdated? res.send(STATUSES_HTTP.NO_CONTENT_204) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    }
]);

commentsRouter.get('/:id', [
    async (req: Request, res: Response) => {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(STATUSES_HTTP.NOT_FOUND_404);
    }
]);

commentsRouter.delete('/:id', [
    authMiddleware,
    async (req: Request, res: Response) => {
        const comment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(STATUSES_HTTP.NOT_FOUND_404).send('Comment is not found');
            return;
        }
        const user = await userService.findUserById(req.userId!) as OutputUser;
        if (comment!.commentatorInfo.userLogin != user.accountData.userName) {
            res.status(STATUSES_HTTP.FORBIDDEN_403).send('Comment is not your own');
            return;
    } else {
            await commentService.deleteCommentById(req.params.id);
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
        }
    }
])

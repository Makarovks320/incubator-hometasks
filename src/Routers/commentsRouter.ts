import {Request, Response, Router} from "express";
import {commentService, InputComment} from "../domain/commentService";
import {CommentOutput} from "../Repositories/commentsRepository";
import {authMiddleware} from "../Middlewares/authMiddleware";
import {OutputUser, userService} from "../domain/userService";
import {commentContentValidation} from "../Middlewares/commentValidations";
import {inputValidator} from "../Middlewares/inputValidator";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware,
    commentContentValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const oldComment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!oldComment) {
            res.status(404).send('Comment is not found');
        }
        const user = await userService.findUserById(req.userId!) as OutputUser;
        if (oldComment!.commentatorInfo.userLogin != user.login) {
            res.status(403).send('Comment is not your own');
        }
        const commentForUpdate : InputComment = {
            content: req.body.content,
        }
        const isUpdated = await commentService.updateComment(commentForUpdate, req.params.id);
        isUpdated? res.send(204) : res.send(404);
    }
]);

commentsRouter.get('/:id', [
    async (req: Request, res: Response) => {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(404);
    }
]);

commentsRouter.delete('/:id', [
    authMiddleware,
    async (req: Request, res: Response) => {
        const comment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment is not found');
        }
        const user = await userService.findUserById(req.userId!) as OutputUser;
        if (comment!.commentatorInfo.userLogin != user.login) {
            res.status(403).send('Comment is not your own');
    } else {
            await commentService.deleteCommentById(req.params.id);
            res.sendStatus(204);
        }
    }
])

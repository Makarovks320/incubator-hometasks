import {Request, Response, Router} from "express";
import {commentService} from "../domain/commentService";
import {authorization} from "../Middlewares/authorization";
import {Comment, CommentOutput, commentsRepository} from "../Repositories/commentsRepository";

export const commentsRouter = Router();

commentsRouter.get('/:id', [
    async (req: Request, res: Response) => {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(404);
    }
]);

commentsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const comment: CommentOutput | null = await commentService.getCommentById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment is not found');
        } else if (comment.commentatorInfo.userLogin != req.userId) {
            res.status(403).send('Comment is not your own');
    } else {
            const result = await commentService.deleteCommentById(req.params.id);
            res.sendStatus(204);
        }
    }
])

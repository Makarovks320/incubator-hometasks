import {Request, Response, Router} from "express";
import {commentService} from "../domain/commentService";
import {CommentOutput} from "../Repositories/commentsRepository";
import {authMiddleware} from "../Middlewares/authMiddleware";

export const commentsRouter = Router();

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
        } else if (comment.commentatorInfo.userLogin != req.userId) {
            res.status(403).send('Comment is not your own');
    } else {
            await commentService.deleteCommentById(req.params.id);
            res.sendStatus(204);
        }
    }
])

import {Request, Response, Router} from "express";
import {commentService} from "../domain/commentService";
import {param} from "express-validator";

export const commentsRouter = Router();

commentsRouter.get('/:id', [
    async (req: Request, res: Response) => {
        const comment = await commentService.getCommentById(req.params.id);
        comment ? res.send(comment) : res.sendStatus(404);
    }
])

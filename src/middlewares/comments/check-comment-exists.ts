import {CommentDBModel} from "../../models/comment/comment-db-model";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import {NextFunction, Request, Response} from "express";
import {commentService} from "../../composition-root";

export async function checkCommentExists (req: Request, res: Response, next: NextFunction) {
    const comment: CommentDBModel | null = await commentService.getCommentById(req.params.id);
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
};
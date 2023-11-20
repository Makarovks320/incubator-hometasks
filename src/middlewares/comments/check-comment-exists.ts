import {CommentDBModel} from "../../models/comment/comment-db-model";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import {NextFunction, Request, Response} from "express";
import {commentsQueryRepository} from "../../composition-root";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../../helpers/string-to-object-id-mapper";

export async function checkCommentExists (req: Request, res: Response, next: NextFunction) {
    const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);
    const comment: CommentDBModel | null = await commentsQueryRepository.getCommentById(commentObjectId);
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
};
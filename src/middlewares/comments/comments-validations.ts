import {body} from "express-validator";
import {inject, injectable} from "inversify";
import {CommentsQueryRepository} from "../../repositories/query-repositories/comments-query-repository";
import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../../helpers/string-to-object-id-mapper";
import {HTTP_STATUSES} from "../../enums/http-statuses";
import {CommentDbType} from "../../models/comment/comment-types";

@injectable()
export class CommentsValidations {
    constructor(
        @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository
    ) {
    }
    commentContentValidation = body('content')
    .trim()
    .isLength({min: 20}).withMessage('min length: 20')
    .isLength({max: 300}).withMessage('max length: 300')
    .notEmpty().withMessage('should not be empty');

    async checkCommentExists(req: Request, res: Response, next: NextFunction) {
        try {
            const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);

            const comment: CommentDbType | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            next();
        } catch {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    };

    async checkCommentBelongsToUser(req: Request, res: Response, next: NextFunction) {
        try {
            const commentObjectId: ObjectId = stringToObjectIdMapper(req.params.id);

            const comment: CommentDbType | null = await this.commentsQueryRepository.getCommentById(commentObjectId);
            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            if (comment.commentatorInfo.userId != req.userId) {
                res.status(HTTP_STATUSES.FORBIDDEN_403).send('Comment is not your own');
                return;
            }
            next();
        } catch {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    };
}


import {Request, Response, Router} from "express";
import {commentService, InputComment, InputCommentWithPostId} from "../domain/commentService";
import {CommentOutput} from "../Repositories/commentsRepository";
import {authMiddleware} from "../Middlewares/authMiddleware";
import {OutputUser, userService} from "../domain/userService";
import {param} from "express-validator";
import {checkPostExists} from "../Middlewares/checkPostExists";
import {idFromUrlExistingValidator} from "../Middlewares/idFromUrlExistingValidator";
import {commentContentValidation} from "../Middlewares/commentValidations";
import {inputValidator} from "../Middlewares/inputValidator";
import {checkCommentExists} from "../Middlewares/checkCommentExists";

export const commentsRouter = Router();

commentsRouter.put('/:id', [
    authMiddleware,
    param('id').custom(checkCommentExists).withMessage('post is not found'),
    idFromUrlExistingValidator,
    commentContentValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const comment: InputComment = {
            content: req.body.content,
        }
        const isUpdated = await commentService.updateComment(comment, req.params.id);
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

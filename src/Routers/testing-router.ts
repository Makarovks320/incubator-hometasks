import {NextFunction, Request, Response, Router} from "express";
import {postService} from "../domain/post-service";
import {blogService} from "../domain/blog-service";
import {userService} from "../domain/user-service";
import {commentService} from "../domain/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {rateLimitingCollection} from "../Repositories/db";
import {sessionService} from "../domain/session-service";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response, next: NextFunction) => {
        Promise.all([
            postService.deleteAllPosts(),
            blogService.deleteAllBlogs(),
            userService.deleteAllUsers(),
            commentService.deleteAllComments(),
            sessionService.deleteAllSessions(),
            rateLimitingCollection.deleteMany({}) // не делал ни сервиса, ни репозитория
        ]).catch((e) => {
            console.log(e.message);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        })

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
)

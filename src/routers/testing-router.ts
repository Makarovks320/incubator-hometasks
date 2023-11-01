import {NextFunction, Request, Response, Router} from "express";
import {postService} from "../services/post-service";
import {blogService} from "../services/blog-service";
import {userService} from "../services/user-service";
import {commentService} from "../services/comment-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {rateLimitingCollection} from "../db/db";
import {sessionService} from "../services/session-service";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
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

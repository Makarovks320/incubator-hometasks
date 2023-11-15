import {NextFunction, Request, Response, Router} from "express";
import {postService} from "../composition-root";
import {blogService} from "../composition-root";
import {userService} from "../composition-root";
import {commentService} from "../composition-root";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {sessionService} from "../services/session-service";
import {RateLimitModel} from "../models/rate-limiting/rate-limiting-model";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
        Promise.all([
            postService.deleteAllPosts(),
            blogService.deleteAllBlogs(),
            userService.deleteAllUsers(),
            commentService.deleteAllComments(),
            sessionService.deleteAllSessions(),
            RateLimitModel.deleteMany({}) // не делал ни сервиса, ни репозитория
        ]).then(() => {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return;
        }).catch((e) => {
            console.log(e.message);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        })
    }
)

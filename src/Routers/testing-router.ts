import {NextFunction, Request, Response, Router} from "express";
import {postService} from "../Services/post-service";
import {blogService} from "../Services/blog-service";
import {userService} from "../Services/user-service";
import {commentService} from "../Services/comment-service";
import {HTTP_STATUSES} from "../Enums/http-statuses";
import {rateLimitingCollection} from "../Repositories/db";
import {sessionService} from "../Services/session-service";

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

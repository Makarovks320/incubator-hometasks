import {NextFunction, Request, Response, Router} from "express";
import {postService} from "../domain/post-service";
import {blogService} from "../domain/blog-service";
import {userService} from "../domain/user-service";
import {commentService} from "../domain/comment-service";
import {STATUSES_HTTP} from "../enums/http-statuses";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response, next: NextFunction) => {
        Promise.all([
            postService.deleteAllPosts(),
            blogService.deleteAllBlogs(),
            userService.deleteAllUsers(),
            commentService.deleteAllComments()
        ]).catch((e) => {
            console.log(e.message);
            res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500);
            return;
        })

        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
        return;
    }
)

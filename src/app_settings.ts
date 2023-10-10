import express, {NextFunction, Request, Response} from 'express';
import {STATUSES_HTTP} from "./enums/http-statuses";
import cookieParser from "cookie-parser";
import {postService} from "./domain/post-service";
import {blogService} from "./domain/blog-service";
import {userService} from "./domain/user-service";
import {commentService} from "./domain/comment-service";
import {postsRouter} from "./Routers/posts-router";
import {blogsRouter} from "./Routers/blogs-router";
import {usersRouter} from "./Routers/users-router";
import {authRouter} from "./Routers/auth-router";
import {commentsRouter} from "./Routers/comments-router";
import {RouterPaths} from "./helpers/router-paths";

export const app = express();

const jsonParser = express.json();
app.use(jsonParser);
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World !!');
});

app.delete('/testing/all-data', async (req: Request, res: Response, next: NextFunction) => {
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

app.use(RouterPaths.posts, postsRouter);
app.use(RouterPaths.blogs, blogsRouter);
app.use(RouterPaths.users, usersRouter);
app.use(RouterPaths.auth, authRouter);
app.use(RouterPaths.comments, commentsRouter);

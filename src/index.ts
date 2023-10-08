import express, {NextFunction, Request, Response} from 'express';
import {runDb} from "./Repositories/db";
import {postsRouter} from "./Routers/posts-router";
import {blogsRouter} from "./Routers/blogs-router";
import {postService} from "./domain/post-service";
import {blogService} from "./domain/blog-service";
import {usersRouter} from "./Routers/users-router";
import {userService} from "./domain/user-service";
import {authRouter} from "./Routers/auth-router";
import {commentService} from "./domain/comment-service";
import {commentsRouter} from "./Routers/comments-router";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
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
            return res.sendStatus(500);
        })

        return res.sendStatus(204)
    }
)

app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);

async function startApp() {
    app.listen(PORT, async () => {
        await runDb();
        console.log(`Server is running at http://localhost:${PORT}/`);
    });
}

startApp();

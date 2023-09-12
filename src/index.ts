import express, {NextFunction, Request, Response} from 'express';
import {runDb} from "./Repositories/db";
import {postsRouter} from "./Routers/posts-router";
import {blogsRouter} from "./Routers/blogs-router";
// import axios from "axios";
import {authorization} from "./Middlewares/authorization";
import {postService} from "./domain/post-service";
import {blogService} from "./domain/blog-service";
import {usersRouter} from "./Routers/users-router";
import {userService} from "./domain/user-service";
import {authRouter} from "./Routers/auth-router";
import {commentService} from "./domain/comment-service";
import {commentsRouter} from "./Routers/comments-router";

const PORT = process.env.PORT || 3000;
export const app = express();

const jsonParser = express.json();
app.use(jsonParser);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World !!');
});
app.delete('/testing/all-data',
    // async (req: Request, res: Response) => {
    // const basicAuth = req.headers.authorization; // Получаем заголовок авторизации из исходного запроса
    //
    // try {
    //     const deleteBlogs = axios.delete(`http://localhost:${PORT}/blogs`, {
    //         headers: {authorization: basicAuth} // Передаем заголовок авторизации в запрос на /blogs
    //     });
    //
    //     const deletePosts = axios.delete(`http://localhost:${PORT}/posts`, {
    //         headers: {authorization: basicAuth} // Передаем заголовок авторизации в запрос на /posts
    //     });
    //
    //     const [blogsResponse, postsResponse] = await Promise.all([deleteBlogs, deletePosts]);
    //
    //     if (blogsResponse.status === 204 && postsResponse.status === 204) {
    //         res.status(204);
    //     }
    //     else res.status(500).send('internal server error');
    // } catch (error) {
    //     // @ts-ignore
    //     res.status(500).send(error.message);
    // }
// }
    async (req: Request, res: Response, next: NextFunction) => {
        await postService.deleteAllPosts();
        next();
    },
    async (req: Request, res: Response, next: NextFunction) => {
        await blogService.deleteAllBlogs();
        next();
    },
    async (req: Request, res: Response, next: NextFunction) => {
        await userService.deleteAllUsers();
        next();
    },
    async (req: Request, res: Response) => {
        await commentService.deleteAllComments();
        res.sendStatus(204);
    },
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

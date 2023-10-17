import express, {Request, Response} from 'express';
import cookieParser from "cookie-parser";
import {postsRouter} from "./Routers/posts-router";
import {blogsRouter} from "./Routers/blogs-router";
import {usersRouter} from "./Routers/users-router";
import {authRouter} from "./Routers/auth-router";
import {commentsRouter} from "./Routers/comments-router";
import {RouterPaths} from "./helpers/router-paths";
import {testingRouter} from "./Routers/testing-router";
import {securityDevicesRouter} from "./Routers/security-devices-router";

export const app = express();

const jsonParser = express.json();
app.use(jsonParser);
app.use(cookieParser());
app.set('trust proxy', true);// для получения корректного ip-адреса через прокси

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World !!');
});

app.use(RouterPaths.posts, postsRouter);
app.use(RouterPaths.blogs, blogsRouter);
app.use(RouterPaths.users, usersRouter);
app.use(RouterPaths.auth, authRouter);
app.use(RouterPaths.comments, commentsRouter);
app.use(RouterPaths.testing, testingRouter);

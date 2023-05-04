import {Request, Response, Router} from "express";

export const postsRouter = Router();

postsRouter.get('/', (req: Request, res: Response) => {
    res.send('hello from postsRouter');
});

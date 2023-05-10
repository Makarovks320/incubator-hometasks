import {Request, Response, Router} from "express";
import {postsRepository} from "../Repositories/postsRepository";

export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts();
    res.send(posts);
});

postsRouter.post('/', async (req: Request, res: Response) => {
    const newPost = await postsRepository.createNewPost(req.body);
    res.send(newPost);
});

postsRouter.delete('/', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts();
    res.sendStatus(204);
});

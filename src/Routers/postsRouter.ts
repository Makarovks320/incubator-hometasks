import {Request, Response, Router} from "express";
import {postService} from "../domain/postService";

export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.send(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const posts = await postService.getPostById(req.params.id);
    posts ? res.send(posts) :res.send(404);
});

postsRouter.post('/', async (req: Request, res: Response) => {
    const newPost = await postService.createNewPost(req.body);
    res.send(newPost);
});

postsRouter.put('/:id', async (req: Request, res: Response) => {
    const newPost = await postService.updatePostById(req.params.id, req.body)
    newPost ?  res.send(newPost) : res.send(404);
});

postsRouter.delete('/', async (req: Request, res: Response) => {
    await postService.deleteAllPosts();
    res.sendStatus(204);
});

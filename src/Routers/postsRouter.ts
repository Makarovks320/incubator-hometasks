import {Request, Response, Router} from "express";
import {postService} from "../domain/postService";
import {authorization} from "../Middlewares/authorization";

export const postsRouter = Router();

postsRouter.get('/',
    async (req: Request, res: Response) => {
        const posts = await postService.getAllPosts();
        res.send(posts);
    });

postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const posts = await postService.getPostById(req.params.id);
        posts ? res.send(posts) : res.send(404);
    });

postsRouter.post('/',
    authorization,
    async (req: Request, res: Response) => {
        const newPost = await postService.createNewPost(req.body);
        res.send(newPost);
    });

postsRouter.put('/:id',
    authorization,
    async (req: Request, res: Response) => {
        const newPost = await postService.updatePostById(req.params.id, req.body)
        newPost ? res.send(newPost) : res.send(404);
    });

postsRouter.delete('/',
    authorization,
    async (req: Request, res: Response) => {
        await postService.deleteAllPosts();
        res.sendStatus(204);
    });

postsRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const blog = await postService.deletePostById(req.params.id);
        blog ? res.status(204).send() : res.status(404).send();
    }
]);

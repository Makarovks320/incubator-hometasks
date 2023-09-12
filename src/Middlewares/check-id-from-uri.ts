import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../Repositories/posts-repository";

export async function checkIdFromUri (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const exist = await postsRepository.findPostById(id);
    exist ? next() :
        res.status(404).send();
}

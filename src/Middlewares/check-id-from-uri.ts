import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../Repositories/posts-repository";
import {HTTP_STATUSES} from "../Enums/http-statuses";

export async function checkIdFromUri (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const exist = await postsRepository.findPostById(id);
    exist ? next() :
        res.status(HTTP_STATUSES.NOT_FOUND_404).send();
}

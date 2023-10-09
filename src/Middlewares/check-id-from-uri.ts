import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../Repositories/posts-repository";
import {STATUSES_HTTP} from "../enums/http-statuses";

export async function checkIdFromUri (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const exist = await postsRepository.findPostById(id);
    exist ? next() :
        res.status(STATUSES_HTTP.NOT_FOUND_404).send();
}

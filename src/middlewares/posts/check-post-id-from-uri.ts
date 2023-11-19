import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../../composition-root";
import {HTTP_STATUSES} from "../../enums/http-statuses";

export async function checkPostIdFromUri (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const exist = await postsRepository.findPostById(id);
    exist ? next() :
        res.status(HTTP_STATUSES.NOT_FOUND_404).send();
}

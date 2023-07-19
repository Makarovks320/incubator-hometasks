import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {userService} from "../domain/userService";

/* миддлвар проверяет заголовок authorization
достает bearer token
дергает getUserIdByToken из jwtService
если юзера нет, то 401
если юзер есть, то добавляет юзера в реквест в поле user */

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    const user = await userService.findUserById(userId);
    if (user) {
        req.userId = user!.id;
        next();
        return;
    }
    res.sendStatus(401);
}

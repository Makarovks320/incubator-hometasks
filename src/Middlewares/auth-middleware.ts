import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domain/user-service";
import mongoose from "mongoose";

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
    if (!userId) return;
    const stringId = userId;
    const objectId = new mongoose.Types.ObjectId(stringId);
    const user = await userService.findUserById(objectId);
    if (user) {
        req.userId = user!._id;
        next();
        return;
    }
    res.sendStatus(401);
}

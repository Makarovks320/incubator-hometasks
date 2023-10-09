import {NextFunction, Request, Response} from "express";
import {STATUSES_HTTP} from "../enums/http-statuses";

export function authorization (req: Request, res: Response, next: NextFunction) {
    // закодируем верные логин и пароль для дальнейшей проверки
    const coded = Buffer.from('admin:qwerty').toString('base64');
    req.headers.authorization === `Basic ${coded}` ? next() :
        res.send(STATUSES_HTTP.UNAUTHORIZED_401);
}

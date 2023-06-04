import {Request, Response, Router} from "express";
import {userService} from "../domain/userService";

export const authRouter = Router();
authRouter.post('/login', async (req: Request, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (checkResult) {
        res.sendStatus(204)
    } else {
        res.sendStatus(401);
    }
})

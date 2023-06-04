import {Request, Response, Router} from "express";
import {userService} from "../domain/userService";
import {jwtService} from "../application/jwtService";

export const authRouter = Router();
authRouter.post('/login', async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = jwtService.createToken(user);
        res.sendStatus(204).send(token);
    } else {
        res.sendStatus(401);
    }
})

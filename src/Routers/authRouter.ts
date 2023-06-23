import {Request, Response, Router} from "express";
import {userService} from "../domain/userService";
import {jwtService} from "../application/jwtService";
import { loginOrEmailAuthValidation, passwordAuthValidation } from "../Middlewares/authValidations";
import { inputValidator } from "../Middlewares/inputValidator";

export const authRouter = Router();
authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = await jwtService.createToken(user);
        res.status(200).send({accessToken: token});
    } else {
        res.sendStatus(401);
    }
}]);
authRouter.get('/me', async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = jwtService.createToken(user);
        res.status(204).send(token);
    } else {
        res.sendStatus(401);
    }
});

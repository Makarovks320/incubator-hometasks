import {Request, Response, Router} from "express";
import {OutputUser, userService} from "../domain/userService";
import {jwtService} from "../application/jwtService";
import {loginOrEmailAuthValidation, passwordAuthValidation} from "../Middlewares/authValidations";
import {inputValidator} from "../Middlewares/inputValidator";
import {authMiddleware} from "../Middlewares/authMiddleware";
import {User} from "../Repositories/usersRepository";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: string
}
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
authRouter.get('/me', [
    authMiddleware,
    async (req: Request, res: Response) => {
        const user: OutputUser | null = await userService.findUserById(req.userId as string)
        if (!user) {
            res.sendStatus(401)
        } else {
            const userAuthMeOutput: UserAuthMeOutput = {
                email: user.email,
                login: user.login,
                userId: user.id
            }
            res.status(200).send(userAuthMeOutput);
        }
    }]);

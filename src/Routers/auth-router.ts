import {Request, Response, Router} from "express";
import {OutputUser, userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {loginOrEmailAuthValidation, passwordAuthValidation} from "../Middlewares/auth-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {authMiddleware} from "../Middlewares/auth-middleware";
import nodemailer from "nodemailer";

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

authRouter.post('/registration', async (req: Request, res: Response) => {

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_APP_PASS
        }
    });
    const info = await transport.sendMail({
        from: `INCUBATOR APP 👻 <${process.env.EMAIL_ADDRESS}>`,
        to: req.body.email,
        subject: "Registration ✔",
        html: "confirmation code"
    });
    console.log(info);

    res.sendStatus(204);
})

import {Request, Response, Router} from "express";
import {OutputUser, userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../Middlewares/auth-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {authMiddleware} from "../Middlewares/auth-middleware";
import nodemailer from "nodemailer";
import {authService} from "../domain/auth-service";
import {ObjectId} from "mongodb";
import {param} from "express-validator";
import {checkBlogExists} from "../Middlewares/check-blog-exists";
import {checkEmailExists} from "../Middlewares/check-email-exists";
import {checkLoginExists} from "../Middlewares/check-login-exists";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: ObjectId
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
        const user: OutputUser | null = await userService.findUserById(req.userId)
        if (!user) {
            res.sendStatus(401)
        } else {
            const userAuthMeOutput: UserAuthMeOutput = {
                email: user.accountData.email,
                login: user.accountData.userName,
                userId: user._id
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

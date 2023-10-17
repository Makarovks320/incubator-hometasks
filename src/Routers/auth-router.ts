import {Router} from "express";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../Middlewares/auth-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {authMiddleware, refreshTokenCheck} from "../Middlewares/auth-middleware";
import {body} from "express-validator";
import {checkEmailExists} from "../Middlewares/check-email-exists";
import {checkLoginExists} from "../Middlewares/check-login-exists";
import {checkConfirmationData} from "../Middlewares/check-confirmation-data";
import {emailValidation} from "../Middlewares/users-validations";
import {authController} from "../Controller/auth-controller";

export const authRouter = Router();
authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    authController.loginUser
]);
authRouter.post('/logout', [
    refreshTokenCheck,//todo: возможно ли вылогиниться, если токен увели? Эта проверка будет посылать сразу
    authController.logoutUser
])
authRouter.post('/refresh-token', [
    refreshTokenCheck,
    authController.refreshToken
])
authRouter.get('/me', [
    authMiddleware,
    authController.getCurrentUserInfo
]);
authRouter.post('/registration', [
    loginAuthValidation,
    emailAuthValidation,
    passwordAuthValidation,
    body('login').custom(checkLoginExists).withMessage('login exists'),
    body('email').custom(checkEmailExists).withMessage('email exists'),
    inputValidator,
    authController.registerNewUser

]);
authRouter.post('/registration-confirmation', [
    body('code').custom(checkConfirmationData).withMessage('wrong code or user is already confirmed'),
    inputValidator,
    authController.confirmRegistration
]);
authRouter.post('/registration-email-resending', [
    emailValidation,
    body('email').custom(checkConfirmationData).withMessage('wrong email or user is already confirmed'),
    inputValidator,
    authController.resendConfirmationCode
]);

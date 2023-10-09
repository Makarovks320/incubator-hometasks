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
import {authMiddleware, refreshTokenCheck} from "../Middlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {ObjectId} from "mongodb";
import {body, oneOf} from "express-validator";
import {checkEmailExists} from "../Middlewares/check-email-exists";
import {checkLoginExists} from "../Middlewares/check-login-exists";
import {checkConfirmationData} from "../Middlewares/check-confirmation-data";
import {emailValidation} from "../Middlewares/users-validations";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {authController} from "../Controller/auth-controller";

type UserAuthMeOutput = {
    email: string,
    login: string,
    userId: ObjectId
}
const refreshTokenOptions = {httpOnly: true,secure: true}

export const authRouter = Router();
authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    authController.loginUser
]);
authRouter.post('/logout', [
    refreshTokenCheck,
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
authRouter.post('/registration-confirmation',[
    body('code').custom(checkConfirmationData).withMessage('wrong code or user is already confirmed'),
    inputValidator,
    authController.confirmRegistration
]);
authRouter.post('/registration-email-resending',[
    emailValidation,
    body('email').custom(checkConfirmationData).withMessage('wrong email or user is already confirmed'),
    inputValidator,
    authController.resendConfirmationCode
]);

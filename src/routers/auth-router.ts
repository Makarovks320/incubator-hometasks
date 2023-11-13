import {Router} from "express";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../middlewares/auth-validations";
import {inputValidator} from "../middlewares/input-validator";
import {authMiddleware, refreshTokenCheck} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {checkEmailExists} from "../middlewares/check-email-exists";
import {checkLoginExists} from "../middlewares/check-login-exists";
import {checkConfirmationData} from "../middlewares/check-confirmation-data";
import {emailValidation} from "../middlewares/users-validations";
import {authController} from "../controllers/auth-controller";
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";

export const authRouter = Router();
authRouter.use(rateLimitMiddleware);

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
authRouter.post('/password-recovery', [
    emailValidation,
    inputValidator,
    authController.passwordRecovery
]);

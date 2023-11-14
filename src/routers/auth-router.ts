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
import {emailValidation, newPasswordValidation} from "../middlewares/users-validations";
import {authController} from "../composition-root";
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";
import {isRecoveryCodeCorrect} from "../middlewares/is-recovery-code-correct";

export const authRouter = Router();
authRouter.use(rateLimitMiddleware);

authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    authController.loginUser.bind(authController)
]);
authRouter.post('/logout', [
    refreshTokenCheck,
    authController.logoutUser.bind(authController)
])
authRouter.post('/refresh-token', [
    refreshTokenCheck,
    authController.refreshToken.bind(authController)
])
authRouter.get('/me', [
    authMiddleware,
    authController.getCurrentUserInfo.bind(authController)
]);
authRouter.post('/registration', [
    loginAuthValidation,
    emailAuthValidation,
    passwordAuthValidation,
    body('login').custom(checkLoginExists).withMessage('login exists'),
    body('email').custom(checkEmailExists).withMessage('email exists'),
    inputValidator,
    authController.registerNewUser.bind(authController)

]);
authRouter.post('/registration-confirmation', [
    body('code').custom(checkConfirmationData).withMessage('wrong code or user is already confirmed'),
    inputValidator,
    authController.confirmRegistration.bind(authController)
]);
authRouter.post('/registration-email-resending', [
    emailValidation,
    body('email').custom(checkConfirmationData).withMessage('wrong email or user is already confirmed'),
    inputValidator,
    authController.resendConfirmationCode.bind(authController)
]);
authRouter.post('/password-recovery', [
    emailValidation,
    inputValidator,
    authController.recoverPassword.bind(authController)
]);
authRouter.post('/new-password', [
    newPasswordValidation,
    inputValidator,
    body('recoveryCode').notEmpty().withMessage('should not be empty'),
    body('recoveryCode').custom(isRecoveryCodeCorrect).withMessage('incorrect confirmation code'),
    inputValidator,
    authController.updatePassword.bind(authController)
]);

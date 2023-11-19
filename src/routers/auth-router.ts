import {Router} from "express";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../middlewares/auth/auth-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {authMiddleware} from "../composition-root";
import {body} from "express-validator";
import {checkEmailExists} from "../middlewares/auth/check-email-exists";
import {checkLoginExists} from "../middlewares/auth/check-login-exists";
import {checkConfirmationData} from "../middlewares/auth/check-confirmation-data";
import {emailValidation, newPasswordValidation} from "../middlewares/users/users-validations";
import {authController} from "../composition-root";
import {rateLimitValidator} from "../middlewares/rate-limiting/rate-limit-validator";
import {recoveryCodeValidator} from "../composition-root";

export const authRouter = Router();
authRouter.use(rateLimitValidator);

authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    authController.loginUser.bind(authController)
]);
authRouter.post('/logout', [
    authMiddleware.refreshTokenCheck.bind(authMiddleware),
    authController.logoutUser.bind(authController)
])
authRouter.post('/refresh-token', [
    authMiddleware.refreshTokenCheck.bind(authMiddleware),
    authController.refreshToken.bind(authController)
])
authRouter.get('/me', [
    authMiddleware.checkBearerToken.bind(authMiddleware),
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
    body('recoveryCode')
        .custom(recoveryCodeValidator.isRecoveryCodeCorrect.bind(recoveryCodeValidator))
        .withMessage('incorrect confirmation code'),
    inputValidator,
    authController.updatePassword.bind(authController)
]);

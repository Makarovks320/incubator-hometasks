import {Router} from "express";
import {
    emailAuthValidation,
    loginAuthValidation,
    loginOrEmailAuthValidation,
    passwordAuthValidation
} from "../middlewares/auth/auth-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {container} from "../composition-root";
import {body} from "express-validator";
import {emailValidation, newPasswordValidation} from "../middlewares/users/users-validations";
import {rateLimitValidator} from "../middlewares/rate-limiting/rate-limit-validator";
import {AuthController} from "../controllers/auth-controller";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";

const authController = container.resolve(AuthController);
const authMiddleware = container.resolve(AuthMiddleware);

export const authRouter = Router();
authRouter.use(rateLimitValidator);

authRouter.post('/login', [
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    inputValidator,
    authController.loginUser.bind(authController)
]);
authRouter.post('/logout', [
    authMiddleware.checkRefreshToken.bind(authMiddleware),
    authController.logoutUser.bind(authController)
])
authRouter.post('/refresh-token', [
    authMiddleware.checkRefreshToken.bind(authMiddleware),
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

    body('login').custom(authMiddleware.checkLoginExists.bind(authMiddleware))
        .withMessage('login exists'),
    body('email').custom(authMiddleware.checkEmailExists.bind(authMiddleware))
        .withMessage('email exists'),
    inputValidator,
    authController.registerNewUser.bind(authController)

]);
authRouter.post('/registration-confirmation', [
    //todo: какая же длинная строка получилась из-за того, что кастомный валидатор перевел в класс authMiddleware!
    body('code').custom(authMiddleware.checkConfirmationData.bind(authMiddleware))
        .withMessage('wrong code or user is already confirmed'),
    inputValidator,
    authController.confirmRegistration.bind(authController)
]);
authRouter.post('/registration-email-resending', [
    emailValidation,
    body('email').custom(authMiddleware.checkConfirmationData.bind(authMiddleware))
        .withMessage('wrong email or user is already confirmed'),
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
        .custom(authMiddleware.isRecoveryCodeCorrect.bind(authMiddleware))
        .withMessage('incorrect confirmation code'),
    inputValidator,
    authController.updatePassword.bind(authController)
]);

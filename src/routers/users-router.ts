import {Router} from "express";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users/users-validations";
import {inputValidator} from "../middlewares/common/input-validator";
import {container} from "../composition-root";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";
import {UsersController} from "../controllers/users-controller";


const authMiddleware = container.resolve(AuthMiddleware);
const usersController = container.resolve(UsersController);
export const usersRouter = Router();
usersRouter.post('/', [
    authMiddleware.checkBasicAuthorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator,
    usersController.createNewUser.bind(usersController)
]);

usersRouter.get('/', [
    authMiddleware.checkBasicAuthorization,
    usersController.getUsers.bind(usersController)
]);

usersRouter.get('/:id', [
    authMiddleware.checkBasicAuthorization,
    usersController.getUserById.bind(usersController)
]);

usersRouter.delete('/:id', [
    authMiddleware.checkBasicAuthorization,
    usersController.deleteUserById.bind(usersController)
]);

usersRouter.delete('/', [
    usersController.deleteAllUsers.bind(usersController)
]);


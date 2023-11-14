import {Router} from "express";
import {authorization} from "../middlewares/authorization";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users-validations";
import {inputValidator} from "../middlewares/input-validator";
import {userController} from "../composition-root";


export const usersRouter = Router();
usersRouter.post('/', [
    authorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator,
    userController.createNewUser.bind(userController)
]);

usersRouter.get('/', [
    authorization,
    userController.getUsers.bind(userController)
]);

usersRouter.get('/:id', [
    authorization,
    userController.getUserById.bind(userController)
]);

usersRouter.delete('/:id', [
    authorization,
    userController.deleteUserById.bind(userController)
]);

usersRouter.delete('/', [
    userController.deleteAllUsers.bind(userController)
]);


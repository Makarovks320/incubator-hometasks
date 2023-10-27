import {Router} from "express";
import {authorization} from "../middlewares/authorization";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users-validations";
import {inputValidator} from "../middlewares/input-validator";
import {usersController} from "../controllers/users-controller";


export const usersRouter = Router();
usersRouter.post('/', [
    authorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator,
    usersController.createNewUser
]);

usersRouter.get('/', [
    authorization,
    usersController.getUsers
]);

usersRouter.get('/:id', [
    authorization,
    usersController.getUserById
]);

usersRouter.delete('/:id', [
    authorization,
    usersController.deleteUserById
]);

usersRouter.delete('/', [
    usersController.deleteAllUsers
]);


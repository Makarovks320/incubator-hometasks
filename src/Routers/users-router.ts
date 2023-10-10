import {Router} from "express";
import {authorization} from "../Middlewares/authorization";
import {emailValidation, loginValidation, passwordValidation} from "../Middlewares/users-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {usersController} from "../Controller/users-controller";


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


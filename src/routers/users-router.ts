import {Router} from "express";
import {authorization} from "../middlewares/authorization";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users-validations";
import {inputValidator} from "../middlewares/input-validator";
import {usersControllerInstance} from "../controllers/users-controller";


export const usersRouter = Router();
usersRouter.post('/', [
    authorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator,
    usersControllerInstance.createNewUser.bind(usersControllerInstance)
]);

usersRouter.get('/', [
    authorization,
    usersControllerInstance.getUsers.bind(usersControllerInstance)
]);

usersRouter.get('/:id', [
    authorization,
    usersControllerInstance.getUserById.bind(usersControllerInstance)
]);

usersRouter.delete('/:id', [
    authorization,
    usersControllerInstance.deleteUserById.bind(usersControllerInstance)
]);

usersRouter.delete('/', [
    usersControllerInstance.deleteAllUsers.bind(usersControllerInstance)
]);


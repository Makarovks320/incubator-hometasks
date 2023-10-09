import {Request, Response, Router} from "express";
import {InputUser, userService} from "../domain/user-service";
import {UserQueryParams, usersQueryRepository} from "../Repositories/users-query-repository";
import {authorization} from "../Middlewares/authorization";
import {emailValidation, loginValidation, passwordValidation} from "../Middlewares/users-validations";
import {inputValidator} from "../Middlewares/input-validator";
import {ObjectId} from "mongodb";
import * as mongoose from "mongoose";
import {STATUSES_HTTP} from "../enums/http-statuses";


type UserForResponseType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export const usersRouter = Router();
usersRouter.post('/', [
    authorization,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator,
    async (req: Request, res: Response) => {
        const newUserInput: InputUser = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const createdUser = await userService.createUser(newUserInput);
        const userForResponse: UserForResponseType = {
            id: createdUser._id.toString(),
            login: createdUser.accountData.userName,
            email: createdUser.accountData.email,
            createdAt: createdUser.accountData.createdAt.toString()
        }
        res.status(STATUSES_HTTP.CREATED_201).send(userForResponse);
    }
]);

usersRouter.get('/', [
    authorization,
    async (req: Request, res: Response) => {
        const queryParams: UserQueryParams = {
            searchLoginTerm: req.query.searchLoginTerm as string || null,
            searchEmailTerm: req.query.searchEmailTerm as string || null,
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy?.toString() || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
        const users = await usersQueryRepository.getUsers(queryParams);
        res.send(users);
    }
]);

usersRouter.get('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const user = await userService.findUserById(objectId as ObjectId);
        user ? res.send(user) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    }
]);

usersRouter.delete('/:id', [
    authorization,
    async (req: Request, res: Response) => {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const user = await userService.deleteUserById(objectId);
        user ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.status(STATUSES_HTTP.NOT_FOUND_404).send();
    }
]);

usersRouter.delete('/', [
    async (req: Request, res: Response) => {
        await userService.deleteAllUsers();
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    }
]);


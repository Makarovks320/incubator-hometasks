import {Request, Response} from "express";
import {InputUser, userService} from "../domain/user-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {UserQueryParams, usersQueryRepository} from "../Repositories/query-repositories/users-query-repository";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";

type UserForResponseType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export const usersController = {

    async createNewUser(req: Request, res: Response) {
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
    },

    async getUsers(req: Request, res: Response) {
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
    },

    async getUserById(req: Request, res: Response) {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const user = await userService.findUserById(objectId as ObjectId);
        user ? res.send(user) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    },

    async deleteUserById(req: Request, res: Response) {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const user = await userService.deleteUserById(objectId);
        user ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.status(STATUSES_HTTP.NOT_FOUND_404).send();
    },

    async deleteAllUsers(req: Request, res: Response) {
        await userService.deleteAllUsers();
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    }
}

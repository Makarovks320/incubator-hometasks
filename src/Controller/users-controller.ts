import {Request, Response} from "express";
import {userService} from "../domain/user-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {usersQueryRepository} from "../Repositories/query-repositories/users-query-repository";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {InputUser, UsersQueryParams, UserViewModel} from "../models/user/user-model";
import {getQueryParamsForUsers} from "../models/query-params-getter";

export const usersController = {

    async createNewUser(req: Request, res: Response) {
        const newUserInput: InputUser = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const createdUser = await userService.createUser(newUserInput);
        const userForResponse: UserViewModel = {
            id: createdUser._id.toString(),
            login: createdUser.accountData.userName,
            email: createdUser.accountData.email,
            createdAt: createdUser.accountData.createdAt.toString()
        }
        res.status(STATUSES_HTTP.CREATED_201).send(userForResponse);
    },

    async getUsers(req: Request, res: Response) {
        const queryParams: UsersQueryParams = getQueryParamsForUsers(req);
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

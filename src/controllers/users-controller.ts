import {Request, Response} from "express";
import {InputUser, UserService} from "../services/user-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../models/user/user-db-model";
import {getQueryParamsForUsers} from "../models/query-params-getter";
import {getUserViewModel} from "../helpers/user-view-model-mapper";
import {UsersQueryParams} from "../models/user/users-query-params";
import {WithPagination} from "../models/common-types-aliases-&-generics/with-pagination-type";
import {UserViewModel} from "../models/user/user-view-model";

export class UsersController {
    constructor(protected userService: UserService ) {}

    async createNewUser(req: Request, res: Response) {
        const newUserInput: InputUser = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const createdUser = await this.userService.createUser(newUserInput);
        const userViewModel = getUserViewModel(createdUser)
        res.status(HTTP_STATUSES.CREATED_201).send(userViewModel);
    }

    async getUsers(req: Request, res: Response) {
        const queryParams: UsersQueryParams = getQueryParamsForUsers(req);
        const usersFromRepo: WithPagination<UserDBModel> = await usersQueryRepository.getUsers(queryParams);
        const users: WithPagination<UserViewModel> = {
            ...usersFromRepo,
            items: usersFromRepo.items.map(u => getUserViewModel(u))
        }
        res.send(users);
    }

    async getUserById(req: Request, res: Response) {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const userDB: UserDBModel | null = await this.userService.findUserById(objectId as ObjectId);
        userDB ? res.send(getUserViewModel(userDB)) : res.send(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteUserById(req: Request, res: Response) {
        const stringId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(stringId);
        const user = await this.userService.deleteUserById(objectId);
        user ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }

    async deleteAllUsers(req: Request, res: Response) {
        await this.userService.deleteAllUsers();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}


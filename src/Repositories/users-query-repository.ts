import {userCollection} from "./db";
import {User} from "./users-repository";
import {Filter, Sort} from "mongodb";
import { OutputUser } from "../domain/user-service";

export type UserQueryParams = {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

type UsersOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputUser[]
}
const PROJECTION = {_id: false, salt: false, hash: false};

export const usersQueryRepository = {
    async getUsers(queryParams: UserQueryParams): Promise<UsersOutput> {
        let filter: Filter<User> = {}
        if (queryParams.searchEmailTerm || queryParams.searchLoginTerm) {
            filter = {
                $or: []
            };
        }
        if (queryParams.searchEmailTerm) {
            filter.$or!.push({"email": {$regex: queryParams.searchEmailTerm, $options: 'i'}});
        }
        if (queryParams.searchLoginTerm) {
            filter.$or!.push({"login": {$regex: queryParams.searchLoginTerm, $options: 'i'}});
        }

        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const users = await userCollection.find(filter, {projection: PROJECTION})
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: users
        }
    },

    async getUserById(id: string): Promise<OutputUser | null> {
        return await userCollection.findOne({id: id}, {projection: PROJECTION});
    }
}

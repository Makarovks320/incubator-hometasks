import {blogCollection, DEFAULT_PROJECTION, userCollection} from "./db";
import {User} from "./usersRepository";
import {Filter, Sort} from "mongodb";

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
    items: User[]
}

export const usersQueryRepository = {
    async getUsers(queryParams: UserQueryParams): Promise<UsersOutput> {
        let filter: Filter<User> = {};
        if (queryParams.searchEmailTerm) {
            filter.email = {$regex: queryParams.searchEmailTerm, $options: 'i'};
        }

        if (queryParams.searchLoginTerm) {
            filter.login = {$regex: queryParams.searchLoginTerm, $options: 'i'};
        }

        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const users = await userCollection.find(filter, { projection: DEFAULT_PROJECTION})
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
    }
};

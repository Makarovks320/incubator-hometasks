import {userCollection} from "../db";
import {UserAccountDBType} from "../users-repository";
import {Filter, ObjectId, Sort} from "mongodb";
import {UsersWithPaginationModel, UsersQueryParams, OutputUser} from "../../models/user/user-model";

const PROJECTION = {emailConfirmation: false};

export const usersQueryRepository = {
    async getUsers(queryParams: UsersQueryParams): Promise<UsersWithPaginationModel> {
        let filter: Filter<UserAccountDBType> = {}
        if (queryParams.searchEmailTerm || queryParams.searchLoginTerm) {
            filter = {
                $or: []
            };
        }
        if (queryParams.searchEmailTerm) {
            filter.$or!.push({"accountData.email": {$regex: queryParams.searchEmailTerm, $options: 'i'}});
        }
        if (queryParams.searchLoginTerm) {
            filter.$or!.push({"accountData.userName": {$regex: queryParams.searchLoginTerm, $options: 'i'}});
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

    async getUserById(id: ObjectId): Promise<OutputUser | null> {
        return await userCollection.findOne({_id: id}, {projection: PROJECTION});
    }
}

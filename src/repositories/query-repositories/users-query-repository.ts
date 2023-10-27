import {userCollection} from "../../db/db";
import {Filter, ObjectId, Sort} from "mongodb";
import {
    UsersWithPaginationModel,
    UsersQueryParams,
    UserDBModel
} from "../../models/user/user-model";
import {getUserViewModel} from "../../helpers/user-view-model-mapper";

export const usersQueryRepository = {
    async getUsers(queryParams: UsersQueryParams): Promise<UsersWithPaginationModel> {
        let filter: Filter<UserDBModel> = {}
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
        const users = await userCollection.find(filter)
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .map(u => getUserViewModel(u))
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

    async getUserById(id: ObjectId): Promise<UserDBModel | null> {
        const result = await userCollection.findOne({_id: id});
        if (result === null) return null;
        return result;
    }
}

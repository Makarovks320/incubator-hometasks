import {UserModel, WITHOUT_v_MONGOOSE_PROJECTION} from "../../db/db";
import {UsersQueryParams} from "../../models/user/users-query-params";
import mongoose from "mongoose";
import {PostDBModel} from "../../models/post/post-db-model";
import {WithPagination} from "../../models/common-types-aliases-&-generics/with-pagination-type";
import {UserDBModel} from "../../models/user/user-db-model";

export const usersQueryRepository = {
    async getUsers(queryParams: UsersQueryParams): Promise<WithPagination<UserDBModel>> {
        let filter: mongoose.FilterQuery<PostDBModel> = {};
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

        const sort: Record<string, 1 | -1> = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const users = await UserModel.find(filter)
            .select(WITHOUT_v_MONGOOSE_PROJECTION)
            .lean()
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize);

        const totalCount = await UserModel.countDocuments(filter);

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: users
        }
    },

    async findUserByPassRecoveryCode(code: string): Promise<UserDBModel | null> {
        return UserModel.findOne({"passwordRecovery.passwordRecoveryCode": code});
    }
}

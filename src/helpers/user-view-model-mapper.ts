import {UserDBModel} from "../models/user/user-db-model";
import {UserViewModel} from "../models/user/user-view-model";

export const getUserViewModel = (user: UserDBModel): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

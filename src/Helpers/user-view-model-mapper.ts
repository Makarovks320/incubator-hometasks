import {UserDBModel, UserViewModel} from "../Models/user/user-model";

export const getUserViewModel = (user: UserDBModel): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

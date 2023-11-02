import {CommonQueryParams} from "../common-types-aliases-&-generics/common-query-params";

export type UsersQueryParams = CommonQueryParams & {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}

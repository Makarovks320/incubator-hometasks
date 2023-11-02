import {CommonQueryParams} from "../common-types-aliases-&-generics/common-query-params";

export type BlogQueryParams = CommonQueryParams & {
    searchNameTerm: string | null
}

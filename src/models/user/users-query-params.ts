import {CommonQueryParams} from "../common-types-aliases-&-generics/common-query-params";

export class UsersQueryParams implements CommonQueryParams {
    constructor (
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: 'asc' | 'desc',
        public searchLoginTerm: string | null,
        public searchEmailTerm: string | null
    ) { }
}

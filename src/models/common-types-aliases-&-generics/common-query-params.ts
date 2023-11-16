export class CommonQueryParams {
    constructor (
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: 'asc' | 'desc'
    ) {
    }
}

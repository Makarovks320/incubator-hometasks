import {Post} from "./postsRepository";
import {postCollection} from "./db";
import {DEFAULT_PROJECTION} from "./blogsRepository";
import {Filter, Sort} from "mongodb";

export type PostQueryParams = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
}

type PostsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Post[]
}

export const postsQueryRepository = {
    async getPosts(queryParams: PostQueryParams, blogId?: string): Promise<PostsOutput> {
        const filter: Filter<Post> = {}
        if (blogId) {
            filter.blogId = {eq: blogId};
        }
        const sort: Sort = {};
        if (queryParams.sortBy) {
            sort[queryParams.sortBy] = queryParams.sortDirection === 'asc' ? 1 : -1;
        }
        const res = await postCollection.find(filter, {projection: DEFAULT_PROJECTION})
            .sort(sort)
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: totalCount,
            items: res
        }
    }
}

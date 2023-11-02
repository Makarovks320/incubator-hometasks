import {Post} from "./post-view-model";
import {WithPagination} from "../common-types-aliases-&-generics/with-pagination-type";

export type PostsQueryViewModel = WithPagination<Post>;

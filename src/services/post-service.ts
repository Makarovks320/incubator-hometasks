import {PostsRepository} from "../repositories/posts-repository";
import {PostDBType, PostDocument, PostModel} from "../models/post/post-db-model";
import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {LIKE_STATUS_ENUM, LikeDbModel, LikeStatusType} from "../models/like/like-db-model";
import {LikeService} from "./like-service";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import {UserService} from "./user-service";
import {convertDbEnumToLikeStatus} from "../helpers/like-status-converters";
import {getPostViewModel} from "../helpers/post-view-model-mapper";
import {PostViewModel} from "../models/post/post-view-model";
import {PostQueryParams} from "../models/post/post-query-params-type";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {WithPagination} from "../models/common-types-aliases-&-generics/with-pagination-type";

export type InputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

@injectable()
export class PostService {
    constructor(@inject(PostsRepository) private postsRepository: PostsRepository,
                @inject(LikeService) private likeService: LikeService,
                @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(UserService) private userService: UserService,
    ) {
    }

    async getPosts(id: string, userId: ObjectId, queryParams: PostQueryParams): Promise<WithPagination<PostViewModel>> {
        const posts: WithPagination<PostDBType> = await this.postsQueryRepository.getPosts(queryParams);
        const promises = posts.items.map(p => {
            return this.likesQueryRepository.getLikeForParentForCurrentUser(p._id, userId);
        });
        const statuses: Array<LikeDbModel | null> = await Promise.all([...promises]).then(data => data);
        const arr: PostViewModel[] = posts.items.map((p, index) => {
            return {
                    id: p._id.toString(),
                    title: p.title,
                    shortDescription: p.shortDescription,
                    content: p.content,
                    blogId: p.blogId,
                    blogName: p.blogName,
                    createdAt: p.createdAt,
                    extendedLikesInfo: {
                        likesCount: p.likesCount,
                        dislikesCount: p.dislikesCount,
                        myStatus: statuses[index] ? convertDbEnumToLikeStatus(statuses[index]!.type)
                                                    : LIKE_STATUS_ENUM.NONE,
                        newestLikes: p.newestLikes
                    }
                }
        });
        return {
            ...posts,
            items: arr
        }

    }

    async getPostById(id: string, userId: ObjectId): Promise<PostViewModel | null> {
        const postObjectId = stringToObjectIdMapper(id);
        const posts = await this.postsRepository.findPostById(postObjectId);
        // сходим за статусом лайка от текущего юзера, если текущий юзер авторизован
        let myStatus: LIKE_STATUS_ENUM | null = null;
        if (userId) {
            const myLike: LikeDbModel | null = await this.likesQueryRepository.getLikeForParentForCurrentUser(postObjectId, userId);
            if (myLike) myStatus = convertDbEnumToLikeStatus(myLike.type);
        }

        return getPostViewModel(posts, myStatus)
    }

    async createNewPost(p: InputPost): Promise<PostDocument> {
        const post: PostDocument = PostModel.createPost(p);
        await this.postsRepository.save(post);
        return post;
    }

    async updatePostById(postId: string, newPostData: InputPost, userId: ObjectId): Promise<void> {
        const post: PostDocument | null = await this.postsRepository.findPostById(postId);
        post.updatePost(newPostData, userId);
        await this.postsRepository.save(post);
    }

    async deleteAllPosts(): Promise<void> {
        await this.postsRepository.deleteAllPosts();
    }

    async deletePostById(id: string): Promise<boolean> {
        const objectId = stringToObjectIdMapper(id);
        return await this.postsRepository.deletePostById(objectId);
    }

    async changeLikeStatus(postId: ObjectId, updateLikeStatus: LikeStatusType, userId: ObjectId): Promise<void> {
        // получаем имя пользователя
        const user = await this.userService.findUserById(userId);
        const userLogin: string = user!.accountData.userName;
        // получим лайк от текущего пользователя
        const previousLike: LikeDbModel | null = await this.likesQueryRepository.getLikeForParentForCurrentUser(postId, userId);
        // получаем текущий пост
        const post: PostDocument | null = await this.postsRepository.findPostById(postId);
        let newOrUpdatedLike: LikeDbModel | null = null;
        if (previousLike) {
            newOrUpdatedLike = await this.likeService.changeLikeStatus(previousLike, updateLikeStatus);
            post.recalculateLikesCount(previousLike.type, updateLikeStatus);
        } else {
            newOrUpdatedLike = await this.likeService.createNewLike(postId, updateLikeStatus, userId);
        }
        if (updateLikeStatus === LIKE_STATUS_ENUM.LIKE) {
            post.insertNewLikeToList(newOrUpdatedLike.updatedAt, userId, userLogin)
        }
        await this.postsRepository.save(post);
    }
}

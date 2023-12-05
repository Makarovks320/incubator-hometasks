import {PostsRepository} from "../repositories/posts-repository";
import {PostDBType, PostDocument, PostModel} from "../models/post/post-db-model";
import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {LIKE_STATUS_ENUM, LikeDbModel, LikeStatusType} from "../models/like/like-db-model";
import {LikeService} from "./like-service";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import {UserService} from "./user-service";

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
                @inject(UserService) private userService: UserService,
                ) {
    }

    async getPostById(id: string): Promise<PostDBType | null> {
        const objectId = stringToObjectIdMapper(id);
        return this.postsRepository.findPostById(objectId);
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

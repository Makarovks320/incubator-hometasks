import {Request, Response} from "express";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {InputPost, PostService} from "../services/post-service";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {CommentService, InputCommentWithPostId} from "../services/comment-service";
import {PostQueryParams} from "../models/post/post-query-params-type";
import {PostViewModel} from "../models/post/post-view-model";
import {CommentViewModel} from "../models/comment/comment-view-model";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {getCommentViewModel} from "../helpers/comment-view-model-mapper";
import {WithPagination} from "../models/common-types-aliases-&-generics/with-pagination-type";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostDBModel} from "../models/post/post-db-model";
import {getPostViewModel} from "../helpers/post-view-model-mapper";
import {LikeDbModel, PARENT_TYPE_DB_ENUM} from "../models/like/like-db-model";
import {LikeService} from "../services/like-service";

@injectable()
export class PostsController {
    constructor(
        @inject(PostService) private postService: PostService,
        @inject(CommentService) private commentService: CommentService,
        @inject(CommentsQueryRepository) private commentQueryRepository: CommentsQueryRepository,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
        @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository,
        @inject(LikeService) private likeService: LikeService,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {
    }

    async getPosts(req: Request, res: Response) {
        const queryParams = new PostQueryParams(
            parseInt(req.query.pageNumber as string) || 1,
            parseInt(req.query.pageSize as string) || 10,
            req.query.sortBy as string || 'createdAt',
            req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        )
        const posts = await this.postsQueryRepository.getPosts(queryParams);
        res.status(HTTP_STATUSES.OK_200).send(posts);
    }

    async getPostById(req: Request, res: Response) {
        const posts = await this.postService.getPostById(req.params.id);
        posts ? res.status(HTTP_STATUSES.OK_200).send(getPostViewModel(posts)) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async createNewPost(req: Request, res: Response) {
        const blog = await this.blogsRepository.findBlogById(req.body.blogId || req.params.id);
        if (!blog) throw new Error('Incorrect blog id: blog is not found');

        const post: InputPost = {
            ...req.body,
            blogId: req.body.blogId || req.params.id,// смотря какой эндпоинт: /posts или /blogs
            blogName: blog.name
        }
        const result: PostDBModel | string = await this.postService.createNewPost(post);

        if (typeof result === 'string') {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
            return;
        }
        const createdPost: PostViewModel = getPostViewModel(result);
        res.status(HTTP_STATUSES.CREATED_201).send(createdPost);
    }

    async updatePost(req: Request, res: Response) {
        const blog = await this.blogsRepository.findBlogById(req.body.blogId);
        if (!blog) throw new Error('Incorrect blog id: blog is not found');

        const newPost = await this.postService.updatePostById(req.params.id, {...req.body, blogName: blog.name});
        newPost ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteAllPosts(req: Request, res: Response) {
        await this.postService.deleteAllPosts();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async deletePostById(req: Request, res: Response) {
        const blog = await this.postService.deletePostById(req.params.id);
        blog ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }

    // комментарии
    async getCommentsForPost(req: Request, res: Response) {
        try {
            const queryParams = new PostQueryParams(
                parseInt(req.query.pageNumber as string) || 1,
                parseInt(req.query.pageSize as string) || 10,
                req.query.sortBy as string || 'createdAt',
                req.query.sortDirection === 'asc' ? 'asc' : 'desc'
            )
            const foundComments: WithPagination<CommentDBModel> = await this.commentQueryRepository.getCommentsForPost(req.params.id, queryParams);
            const commentsWithLikesInfo: WithPagination<CommentViewModel> = await this.likesQueryRepository.findLikesForManyComments(foundComments, req.userId);
            res.status(HTTP_STATUSES.OK_200).send(commentsWithLikesInfo);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db Error');
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        }
    }

    async createCommentToPost(req: Request, res: Response) {
        const comment: InputCommentWithPostId = {
            content: req.body.content,
            postId: req.params.id
        }
        const result: CommentDBModel | string = await this.commentService.createNewComment(comment, req.userId);
        if (typeof result === 'string') {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
            return;
        }
        const createdComment: CommentViewModel = getCommentViewModel(result);
        res.status(HTTP_STATUSES.CREATED_201).send(createdComment);
    }

    // лайки
    async changeLikeStatus(req: Request, res: Response) {
        try {
            const post: PostDBModel | null = await this.postService.getPostById(req.params.id);

            // если у текущего пользователя есть лайк для данного поста, то изменим его, если нет - создадим
            const currentLike: LikeDbModel | null = await this.likesQueryRepository.getLikeForParentForCurrentUser(post!._id, req.userId);
            currentLike ?
                await this.likeService.changeLikeStatus(currentLike, req.body.likeStatus)
                : await this.likeService.createNewLike(PARENT_TYPE_DB_ENUM.POST, post!._id, req.userId, req.body.likeStatus);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } catch (e) {
            if (e instanceof mongoose.Error) res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Db error');
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send('Something went wrong');
        }
    }
}

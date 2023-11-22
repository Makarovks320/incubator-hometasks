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
import {ObjectId} from "mongodb";
import {WithPagination} from "../models/common-types-aliases-&-generics/with-pagination-type";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";
import mongoose from "mongoose";

export class PostsController {
    constructor(
        private postService: PostService,
        private commentService: CommentService,
        private commentQueryRepository: CommentsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
        private likesQueryRepository: LikesQueryRepository
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
        res.send(posts);
    }

    async getPostById(req: Request, res: Response) {
        const posts = await this.postService.getPostById(req.params.id);
        posts ? res.send(posts) : res.send(HTTP_STATUSES.NOT_FOUND_404);
    }

    async createNewPost(req: Request, res: Response) {
        const post: InputPost = {
            ...req.body,
            blogId: req.body.blogId ? req.body.blogId : req.params.id,// смотря какой эндпоинт: /posts или /blogs
            blogName: req.blogName
        }
        const result: PostViewModel | string = await this.postService.createNewPost(post);
        if (typeof result === 'string') {
            res.status(HTTP_STATUSES.SERVER_ERROR_500).send(result);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(result);
    }

    async updatePost(req: Request, res: Response) {
        const newPost = await this.postService.updatePostById(req.params.id, req.body)
        newPost ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.send(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteAllPosts(req: Request, res: Response) {
        await this.postService.deleteAllPosts();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async deletePostById(req: Request, res: Response) {
        const blog = await this.postService.deletePostById(req.params.id);
        blog ? res.status(HTTP_STATUSES.NO_CONTENT_204).send() : res.status(HTTP_STATUSES.NOT_FOUND_404).send();
    }

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
            res.send(commentsWithLikesInfo);
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
}

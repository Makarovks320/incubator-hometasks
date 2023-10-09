import {Request, Response} from "express";
import {PostQueryParams, postsQueryRepository} from "../Repositories/posts-query-repository";
import {InputPost, postService} from "../domain/post-service";
import {STATUSES_HTTP} from "../enums/http-statuses";
import {commentQueryRepository} from "../Repositories/comment-query-repository";
import {commentService, InputCommentWithPostId} from "../domain/comment-service";

export const postsController = {
    async getPosts(req: Request, res: Response) {
        const queryParams: PostQueryParams = {
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy as string || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
        const posts = await postsQueryRepository.getPosts(queryParams);
        res.send(posts);
    },

    async getPostById(req: Request, res: Response) {
        const posts = await postService.getPostById(req.params.id);
        posts ? res.send(posts) : res.send(STATUSES_HTTP.NOT_FOUND_404);
    },

    async createNewPost(req: Request, res: Response) {
        const post: InputPost = {
            ...req.body,
            blogId: req.body.blogId,
            blogName: req.blogName
        }
        const newPost = await postService.createNewPost(post);
        res.status(STATUSES_HTTP.CREATED_201).send(newPost);
    },

    async updatePost(req: Request, res: Response) {
        const newPost = await postService.updatePostById(req.params.id, req.body)
        newPost ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.send(STATUSES_HTTP.NOT_FOUND_404);
    },

    async deleteAllPosts(req: Request, res: Response) {
        await postService.deleteAllPosts();
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
    },

    async deletePostById(req: Request, res: Response) {
        const blog = await postService.deletePostById(req.params.id);
        blog ? res.status(STATUSES_HTTP.NO_CONTENT_204).send() : res.status(STATUSES_HTTP.NOT_FOUND_404).send();
    },

    async getCommentsForPost(req: Request, res: Response) {
        const queryParams: PostQueryParams = {
            pageNumber: parseInt(req.query.pageNumber as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 10,
            sortBy: req.query.sortBy as string || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
        const comments = await commentQueryRepository.getCommentsForPost(req.params.id, queryParams);
        res.send(comments);
    },

    async createCommentToPost(req: Request, res: Response) {
        const comment: InputCommentWithPostId = {
            content: req.body.content,
            postId: req.params.id
        }
        const newComment = await commentService.createNewComment(comment, req.userId);
        res.status(STATUSES_HTTP.CREATED_201).send(newComment);
    }
}

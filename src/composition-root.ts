import {UsersRepository} from "./repositories/users-repository";
import {UserService} from "./services/user-service";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller";
import {AuthService} from "./services/auth-service";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentService} from "./services/comment-service";
import {CommentsController} from "./controllers/comments-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostService} from "./services/post-service";
import {PostsController} from "./controllers/posts-controller";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogService} from "./services/blog-service";
import {BlogsController} from "./controllers/blogs-controller";

// users dependencies
const usersRepository = new UsersRepository;
export const userService = new UserService(usersRepository);
export const userController = new UsersController(userService);

// auth dependencies
const authService = new AuthService(usersRepository);
export const authController = new AuthController(authService, userService)

//comments dependencies
const commentsRepository = new CommentsRepository;
export const commentService = new CommentService(commentsRepository);
export const commentController = new CommentsController(commentService);

//posts dependencies
export const postsRepository = new PostsRepository();
export const postService = new PostService(postsRepository);
export const postsController = new PostsController(postService);

//blogs deps
export const blogsRepository = new BlogsRepository;
export const blogService = new BlogService(blogsRepository);
export const blogsController = new BlogsController(blogService);



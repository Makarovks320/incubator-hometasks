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
import {SessionsRepository} from "./repositories/sessions-repository";
import {SecurityDevicesController} from "./controllers/security-devices-controller";
import {SessionService} from "./services/session-service";
import {AuthMiddleware} from "./middlewares/auth-middleware";
import {JwtService} from "./application/jwt-service";
import {BlogsQueryRepository} from "./repositories/query-repositories/blogs-query-repository";
import {CommentQueryRepository} from "./repositories/query-repositories/comment-query-repository";
import {PostsQueryRepository} from "./repositories/query-repositories/posts-query-repository";
import {UsersQueryRepository} from "./repositories/query-repositories/users-query-repository";
import {RecoveryCodeValidator} from "./middlewares/is-recovery-code-correct";
import {EmailManager} from "./managers/emailManager";
import {EmailAdapter} from "./adapters/email-adapter";

// common services
export const jwtService = new JwtService;
export const emailAdapter = new EmailAdapter;
const emailManager = new EmailManager(emailAdapter);

// users dependencies
export const usersRepository = new UsersRepository;
const usersQueryRepository = new UsersQueryRepository;
const userService = new UserService(usersRepository);

// auth dependencies
const authService = new AuthService(usersRepository, jwtService, emailManager);

// comments dependencies
const commentsRepository = new CommentsRepository;
const commentQueryRepository = new CommentQueryRepository;
export const commentService = new CommentService(commentsRepository, userService);

// posts dependencies
export const postsRepository = new PostsRepository;
const postsQueryRepository = new PostsQueryRepository;
const postService = new PostService(postsRepository);

// blogs deps
export const blogsRepository = new BlogsRepository;
const blogsQueryRepository = new BlogsQueryRepository;
const blogService = new BlogService(blogsRepository);

// sessions deps
const sessionsRepository = new SessionsRepository;
const sessionService = new SessionService(sessionsRepository, jwtService);

// controllers
export const userController = new UsersController(userService, usersQueryRepository);
export const authController = new AuthController(authService, userService, sessionService, jwtService)
export const commentController = new CommentsController(commentService, userService);
export const postsController = new PostsController(postService, commentService, commentQueryRepository, postsQueryRepository);
export const blogsController = new BlogsController(blogService, blogsQueryRepository, postsQueryRepository);
export const securityDevicesController = new SecurityDevicesController(sessionService, jwtService);

// middlewares
export const authMiddleware = new AuthMiddleware(userService, jwtService)
export const recoveryCodeValidator = new RecoveryCodeValidator(usersQueryRepository);

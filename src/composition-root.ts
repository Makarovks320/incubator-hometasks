import "reflect-metadata";
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
import {AuthMiddleware} from "./middlewares/auth/auth-middleware";
import {JwtService} from "./application/jwt-service";
import {BlogsQueryRepository} from "./repositories/query-repositories/blogs-query-repository";
import {CommentsQueryRepository} from "./repositories/query-repositories/comments-query-repository";
import {PostsQueryRepository} from "./repositories/query-repositories/posts-query-repository";
import {UsersQueryRepository} from "./repositories/query-repositories/users-query-repository";
import {RecoveryCodeValidator} from "./middlewares/auth/is-recovery-code-correct";
import {EmailManager} from "./managers/emailManager";
import {EmailAdapter} from "./adapters/email-adapter";
import {LikeService} from "./services/like-service";
import {LikesRepository} from "./repositories/likes-repository";
import {LikesQueryRepository} from "./repositories/query-repositories/likes-query-repository";
import {Container} from "inversify";

export const container = new Container;
// common services
container.bind(JwtService).to(JwtService);
container.bind(EmailAdapter).to(EmailAdapter);
container.bind(EmailManager).to(EmailManager);

// users dependencies
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UserService).to(UserService);

// auth dependencies
container.bind(AuthService).to(AuthService);

// comments dependencies
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentService).to(CommentService);

// posts dependencies
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostService).to(PostService);

// blogs deps
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogService).to(BlogService);

// sessions deps
container.bind(SessionsRepository).to(SessionsRepository);
container.bind(SessionService).to(SessionService);

// likes
container.bind(LikesRepository).to(LikesRepository);
container.bind(LikesQueryRepository).to(LikesQueryRepository);
container.bind(LikeService).to(LikeService);

// controllers
container.bind(UsersController).to(UsersController);
container.bind(AuthController).to(AuthController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(BlogsController).to(BlogsController);
container.bind(SecurityDevicesController).to(SecurityDevicesController);

// middlewares
container.bind(AuthMiddleware).to(AuthMiddleware);
container.bind(RecoveryCodeValidator).to(RecoveryCodeValidator);

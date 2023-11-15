import {UsersRepository} from "./repositories/users-repository";
import {UserService} from "./services/user-service";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller";
import {AuthService} from "./services/auth-service";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentService} from "./services/comment-service";
import {CommentsController} from "./controllers/comments-controller";

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

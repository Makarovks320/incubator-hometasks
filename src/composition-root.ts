import {UsersRepository} from "./repositories/users-repository";
import {UserService} from "./services/user-service";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller";
import {AuthService} from "./services/auth-service";

const usersRepository = new UsersRepository;
export const userService = new UserService(usersRepository);
export const userController = new UsersController(userService);
const authService = new AuthService(usersRepository);
export const authController = new AuthController(authService, userService)

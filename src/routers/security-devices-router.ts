import {Router} from "express";
import {container} from "../composition-root";
import {AuthMiddleware} from "../middlewares/auth/auth-middleware";
import {SecurityDevicesController} from "../controllers/security-devices-controller";


const securityDevicesController = container.resolve(SecurityDevicesController);
const authMiddleware = container.resolve(AuthMiddleware);
export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/:deviceId', [
    authMiddleware.checkRefreshToken.bind(authMiddleware),
    securityDevicesController.deleteSessionByDeviceId.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/', [
    authMiddleware.checkRefreshToken.bind(authMiddleware),
    securityDevicesController.deleteAllSessionsForUserExcludeCurrent.bind(securityDevicesController)
]);


import {Router} from "express";
import {securityDevicesController} from "../controllers/security-devices-controller";
import {refreshTokenCheck} from "../middlewares/auth-middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser
]);

securityDevicesRouter.delete('/:deviceId', [
    refreshTokenCheck,
    securityDevicesController.deleteSessionByDeviceId
]);

securityDevicesRouter.delete('/', [
    refreshTokenCheck,
    securityDevicesController.deleteAllSessionsForUserExcludeCurrent
]);


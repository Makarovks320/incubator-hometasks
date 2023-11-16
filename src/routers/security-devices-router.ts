import {Router} from "express";
import {securityDevicesController} from "../composition-root";
import {authMiddleware} from "../composition-root";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/:deviceId', [
    authMiddleware.refreshTokenCheck.bind(authMiddleware),
    securityDevicesController.deleteSessionByDeviceId.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/', [
    authMiddleware.refreshTokenCheck.bind(authMiddleware),
    securityDevicesController.deleteAllSessionsForUserExcludeCurrent.bind(securityDevicesController)
]);


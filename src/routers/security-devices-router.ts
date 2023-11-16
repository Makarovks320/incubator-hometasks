import {Router} from "express";
import {securityDevicesController} from "../composition-root";
import {refreshTokenCheck} from "../middlewares/auth-middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/:deviceId', [
    refreshTokenCheck,
    securityDevicesController.deleteSessionByDeviceId.bind(securityDevicesController)
]);

securityDevicesRouter.delete('/', [
    refreshTokenCheck,
    securityDevicesController.deleteAllSessionsForUserExcludeCurrent.bind(securityDevicesController)
]);


import {Router} from "express";
import {securityDevicesController} from "../Controllers/securityDevicesController";
import {refreshTokenCheck} from "../Middlewares/auth-middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser
]);

securityDevicesRouter.delete('/:deviceId', [
    refreshTokenCheck,
    securityDevicesController.deleteSessionByDeviceId
]);


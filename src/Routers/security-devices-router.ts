import {Router} from "express";
import {securityDevicesController} from "../Controller/securityDevicesController";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/', [
    securityDevicesController.getAllSessionsForUser
])


import {NextFunction, Request, Response} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../enums/http-statuses";

export const inputValidator = (req: Request, res: Response, next: NextFunction) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: (error: ValidationError) => {
            return {
                msg: error.msg,
                // todo: как быть, что правильнее возвращать?
                param: error.type === "field" ? error.path : "unknown field"
            };
        },
    });
    const result = myValidationResult(req).array();
    if (!result.length) {
        next();
    } else {
        // @ts-ignore
        const mergedByProperty = result.reduce((result, obj) => ({
            ...result,
            [obj.param]: {
                field: obj.param,
                // @ts-ignore
                message: result[obj.param] ? `${result[obj.param].message}; ${obj.msg}` : obj.msg
            }
        }), {});
        const errorsMessages: any = [];
        for (let obj in mergedByProperty) {
            //todo: Possible iteration over unexpected members, probably missing hasOwnProperty check
            // @ts-ignore
            errorsMessages.push({message: mergedByProperty[obj].message, field: mergedByProperty[obj].field})
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errorsMessages});
    }
};

import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {STATUSES_HTTP} from "../enums/http-statuses";

// типы для режима без any
// type Error = {
//     message: string,
//     field: string
// }
// type InitError = {
//     msg: string,
//     param: string,
//     location: string
// }
export const inputValidator =
    (req: Request, res: Response, next: NextFunction) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                msg: error.msg,
                param: error.param
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
        res.status(STATUSES_HTTP.BAD_REQUEST_400).send({errorsMessages: errorsMessages});
    }
};

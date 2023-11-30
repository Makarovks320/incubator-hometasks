import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../enums/http-statuses";

export const idFromUrlExistingValidator = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
    } else {
        const array = JSON.parse(JSON.stringify(result));
        if (array.errors[0].param === 'id') {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send({errorsMessages:
                    [
                        {
                            message: array.errors[0].msg,
                            field: array.errors[0].param
                        }
                    ]
            });
        }
    }
};

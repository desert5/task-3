import {IllegalArgumentException} from "./illegal-argument-exception";
import {UnableToComputeException} from "./unable-to-compute";
import {Request, Response} from "express";

const exceptionHandler = (err: Error, req: Request, res: Response, next: any) => {
    if (err instanceof UnableToComputeException) {
        return res.status(404).json({
            status: 'error',
            message: err.message
        });
    } else if (err instanceof IllegalArgumentException) {
        return res.status(422).json({
            status: 'error',
            message: err.message
        })
    }

    return res.status(500).json({
        status: 'error',
        message: err.message
    });
}

export default exceptionHandler
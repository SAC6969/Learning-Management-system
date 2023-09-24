import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const ErrorMiddleware = (e:any, req:Request, res:Response, next:NextFunction) => {
    e.statusCode = e.statusCode || 500;
    e.message = e.message || 'Internal Server Error';

    // wrong mongodb url
    if(e.name == 'CastError'){
        const message = `Resource not found: ${e.path}`;
        e = new ErrorHandler(message,400);
    }

    //duplicate key error
    if(e.name == 11000){
        const message = `Duplicate ${Object.keys(e.keyValue)} entered`;
        e = new ErrorHandler(message,400);
    }

    // wrong jwt error
    if(e.name == 'JsonWebTokenError'){
        const message = `Json web token is invalid, try again!`;
        e = new ErrorHandler(message,400);
    }

    // token expired
    if(e.name == 'TokenExpiredError'){
        const message = `Json web token is expired, try again!`;
        e = new ErrorHandler(message,400);
    }

    res.status(e.statusCode).json({message:e.message});
}
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(new ErrorHandler("Please login to access this resource", 400));
    }

    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decode) {
        return next(new ErrorHandler("access token is not valid", 400));
    }

    const user = await redis.get(decode.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }

    req.user = JSON.parse(user);

    next();
})

export const authorization = (...role: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(role.includes(req.user?.role || '')){
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resouce`, 400));
        }
        next()
    }
}
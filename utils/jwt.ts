require('dotenv').config();
import { Response } from "express";
import { IUSer } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUSer, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // upload session to redis
    redis.set(user._id,JSON.stringify(user) as any);

    // parse environmet variables
    const accessTokenExpired = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
    const refreshTokenExpired = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '300', 10);

    // options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpired * 100),
        maxAge: accessTokenExpired * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpired * 100),
        maxAge: refreshTokenExpired * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

    // only set secure to true
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        user,
        accessToken
    })
}

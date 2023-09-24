require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';

export const app = express();

//  body parser
app.use(express.json({ limit: '50mb' }));

//  cookie parser
app.use(cookieParser());

// cors
app.use(cors({
    origin: process.env.ORIGIN
}));

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    })
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const e = new Error(`Not Found: 400`) as any;
    e.statusCode = 404;
    next(e);
})

app.use(ErrorMiddleware);
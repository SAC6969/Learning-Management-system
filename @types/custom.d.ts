import { Request } from "express";
import { IUSer } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUSer
        }
    }
}
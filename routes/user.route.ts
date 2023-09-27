import express from 'express';
import { activateUser, loginUser, logoutUser, registration } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registartion', registration);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', isAuthenticated, logoutUser);


export default userRouter;
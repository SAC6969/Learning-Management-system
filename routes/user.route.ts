import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registration, socialAuth, updateAccessToken } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registartion', registration);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', isAuthenticated, logoutUser);

userRouter.get('/refreshtoken', updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/socialauth", socialAuth);



export default userRouter;
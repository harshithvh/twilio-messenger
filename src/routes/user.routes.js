import {Router} from 'express';
import { registerUser, loginUser, currentUser } from '../controller/user.controller.js';
import { protect } from '../middleware/auth.middlware.js';

const userRouter = Router();

// Register a new user
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/',protect, currentUser);

export default userRouter;
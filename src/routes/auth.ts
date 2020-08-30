import { Router } from "express";
import { login, register, refresh, logout } from "../controllers/authController";

const authRouter: Router = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export default authRouter;
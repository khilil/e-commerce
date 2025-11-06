import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = Router();

//! User Routes 
router.route('/register').post(registerUser)
router.route('/login').post( loginUser)
router.route('/logout').post(verifyAuth, logoutUser);

export default router;
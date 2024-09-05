import { Router } from "express";

// Controllers
import { register, login } from "../controllers/authController.js";

const router = Router();

/**
 * Route for user registration.
 * @name POST /register
 * @function
 */
router.post("/register", register);

/**
 * Route for user login.
 * @name POST /login
 * @function
 */
router.post("/login", login);

export default router;

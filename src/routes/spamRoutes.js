import { Router } from "express";

// Controllers
import { reportSpam } from "../controllers/spamController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

/**
 * Route for reporting spam.
 * @name POST /report
 * @function
 */
router.post("/report", authenticateToken, reportSpam);

export default router;

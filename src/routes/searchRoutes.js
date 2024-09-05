import { Router } from "express";

// Controllers
import {
  searchByName,
  searchByPhone,
  searchPersonDetails,
} from "../controllers/searchController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

/**
 * Route for searching by name.
 * @name GET /name
 * @function
 */
router.get("/name", authenticateToken, searchByName);

/**
 * Route for searching by phone.
 * @name GET /phone
 * @function
 */
router.get("/phone", authenticateToken, searchByPhone);

/**
 * Route for getting person details.
 * @name GET /person/details
 * @function
 */
router.get("/person/details", authenticateToken, searchPersonDetails);

export default router;

import jwt from "jsonwebtoken";

/**
 * Middleware function to authenticate a token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

import prisma from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// utils
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prismaClient = new prisma.PrismaClient();

/**
 * Registers a new user with the provided details.
 *
 * @async
 * @function register
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password for the user's account.
 * @returns {Object} JSON response with a success message and user data, or an error message if the phone number is already in use.
 * @throws {ApiError} If the phone number is already in use.
 */
export const register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  const existingUser = await prismaClient.user.findUnique({ where: { phone } });
  if (existingUser) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Phone number is already in use. Please retry with a new phone number"
        )
      );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: {
      name,
      phone,
      email,
      password: hashedPassword,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));
};

/**
 * Authenticates a user and returns a JWT token upon successful login.
 *
 * @async
 * @function login
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password for the user's account.
 * @returns {Object} JSON response with a JWT token upon successful login, or an error message if authentication fails.
 * @throws {ApiError} If the phone number or password is incorrect.
 */
export const login = async (req, res) => {
  const { phone, password } = req.body;

  const user = await prismaClient.user.findUnique({ where: { phone } });
  if (!user) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid phone number or password"));
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid phone number or password"));
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json(new ApiResponse(200, { token }, "Login successful"));
};

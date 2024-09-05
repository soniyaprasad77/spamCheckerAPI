import prisma from "@prisma/client";

// utils
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prismaClient = new prisma.PrismaClient();

/**
 * Searches for users by name in the database.
 * The search results prioritize names that start with the query string,
 * followed by names that contain the query string.
 *
 * @async
 * @function searchByName
 * @param {string} req.query.query - The query string to search for in user names.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with search results, or an error message if the query parameter is missing.
 * @throws {ApiError} If the query parameter is missing.
 */
export const searchByName = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json(new ApiError(400, "Query parameter is required"));
  }

  const results = await prismaClient.user.findMany({
    where: {
      name: {
        startsWith: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      phone: true,
      spamReports: true,
    },
  });

  if (results.length === 0) {
    const alternativeResults = await prismaClient.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        spamReports: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, alternativeResults, "Search results by name"));
  }

   res.status(200).json(new ApiResponse(200, results, "Search results by name"));
};

/**
 * Searches for users or contacts by phone number in the database.
 * If a registered user with the exact phone number is found, only that result is returned.
 * If no registered user is found, contacts matching the phone number are returned.
 *
 * @async
 * @function searchByPhone
 * @param {string} req.query.phone - The phone number to search for in the database.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with search results, or an error message if the phone parameter is missing.
 * @throws {ApiError} If the phone parameter is missing.
 */
export const searchByPhone = async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json(new ApiError(400, "Phone number is required"));
  }

  const userResult = await prismaClient.user.findUnique({
    where: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      spamReports: true,
      email: true,
    },
  });

  if (userResult) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, [userResult], "Search results by Phone number")
      );
  }

  const contactResults = await prismaClient.contact.findMany({
    where: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      user: {
        select: {
          spamReports: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, contactResults, "Search results by Phone number")
    );
};

/**
 * Retrieves the details of a person by their user ID.
 * The email address of the person is only included in the response if the person is a registered user
 * and the currently authenticated user is in the person's contact list.
 *
 * @async
 * @function searchPersonDetails
 * @param {string} req.query.userId - The ID of the user whose details are being requested.
 * @param {Object} req.user - The authenticated user object provided by the authentication middleware.
 * @param {number} req.user.userId - The ID of the currently authenticated user making the request.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the person's details, or an error message if the user ID is missing or the user is not found.
 * @throws {ApiError} If the user ID is not provided or the user is not found in the database.
 */
export const searchPersonDetails = async (req, res) => {
  const { userId } = req.query;
  const { userId: currentUserId } = req.user;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User ID is required"));
  }

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      spamReports: true,
    },
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const isContact = await prismaClient.contact.findFirst({
    where: {
      userId: user.id,
      phone: user.phone,
      user: { id: currentUserId },
    },
  });

  if (!isContact) {
    user.email = null;
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "Person details retrieved successfully"));
};

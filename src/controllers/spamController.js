import prisma from "@prisma/client";

// utils
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prismaClient = new prisma.PrismaClient();

/**
 * Reports a phone number as spam by creating a spam report in the database.
 * The report is associated with the currently authenticated user.
 *
 * @async
 * @function reportSpam
 * @param {string} req.body.phone - The phone number to be reported as spam.
 * @param {Object} req.user - The authenticated user object, provided by the authentication middleware.
 * @param {number} req.user.userId - The ID of the authenticated user reporting the spam.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with the details of the spam report, or an error message if the phone number is missing.
 * @throws {ApiError} If the phone number is not provided in the request body.
 */
export const reportSpam = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json(new ApiError(400, "Phone number is required"));
  }

  const spamReport = await prismaClient.spamReport.create({
    data: {
      phone,
      reportedById: req.user.userId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, spamReport, "Spam report submitted"));
};

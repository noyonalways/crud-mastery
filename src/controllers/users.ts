import { NextFunction, Request, RequestHandler, Response } from "express";
import { createNewUser, findUsers } from "../services/users";
import { ErrorResponse } from "../app/error";
import mongoose from "mongoose";

export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, fullName, age, email, address } = req.body;

    const user = await createNewUser({
      username,
      password,
      fullName,
      age,
      email,
      address,
    });
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    let customError;
    if (error instanceof mongoose.Error.ValidationError) {
      // The validation error occurred
      const validationErrors = error.errors;

      // Extract and log error messages
      for (const field of Object.keys(validationErrors)) {
        const errorMessage = validationErrors[field].message;
        customError = new ErrorResponse(false, errorMessage, {
          code: 400,
          description: errorMessage,
        });
      }
    } else {
      // Handle other types of errors
      console.error(error);
    }

    next(customError);
  }
};

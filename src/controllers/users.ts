import {
  UpdateUserValidationSchema,
  UserValidationSchema,
} from "./../validation/users";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  createNewUser,
  findUserByProperty,
  findUsers,
  updateUserPut,
} from "../services/users";
import { ErrorResponse } from "../app/error";
import mongoose from "mongoose";
import { User } from "../models/User";

// Get all users
export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: User[] = await findUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Create user
export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;

    const validationData = await UserValidationSchema.safeParse({
      ...userData,
    });

    if (!validationData.success) {
      const customError = new ErrorResponse(
        false,
        validationData.error.issues[0].message,
        {
          code: 400,
          description: validationData.error.issues[0].message,
        }
      );

      return res.status(400).json(customError);
    }

    const user = (await createNewUser({
      ...validationData.data,
    })) as Partial<User>;

    user.password = undefined;

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

// Get user by userId
export const getUserByProperty: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = (await findUserByProperty("userId", userId)) as Partial<User>;

    if (!user) {
      const customError = new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User not found",
      });
      throw customError;
    }

    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Updater user by userId PUT Request
export const updateUserInfoPut: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const userUpdateInfo = req.body;

    const validationData = await UpdateUserValidationSchema.safeParse({
      ...userUpdateInfo,
    });

    if (!validationData.success) {
      const customError = new ErrorResponse(
        false,
        validationData.error.issues[0].message,
        {
          code: 400,
          description: validationData.error.issues[0].message,
        }
      );
      return res.status(400).json(customError);
    }

    const user = await updateUserPut(userId, { ...validationData.data });

    if (!user) {
      const customError = new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User not found",
      });
      throw customError;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user by userId
export const deleteUserByUserId: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await findUserByProperty("userId", userId);
    if (!user) {
      const customError = new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User not found",
      });
      throw customError;
    }
    const result = await user.deleteOne();
    if (result.acknowledged) {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

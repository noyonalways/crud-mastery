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

export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: User[] = await findUsers();

    // Create a new array with users excluding the password
    const usersWithoutPassword = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        password,
        createdAt,
        updatedAt,
        hobbies,
        orders,
        isActive,
        __v,
        _id,
        ...userWithoutPassword
      } = user.toObject();
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersWithoutPassword,
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

    const user = (await createNewUser({
      username,
      password,
      fullName,
      age,
      email,
      address,
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

export const updateUserInfoPut: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { username, password, fullName, age, email, address, hobbies } =
      req.body;
    const user = await updateUserPut(userId, {
      username,
      password,
      fullName,
      age,
      email,
      address,
      hobbies,
    });
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

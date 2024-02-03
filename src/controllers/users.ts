import { NextFunction, Request, RequestHandler, Response } from "express";
import UserModel from "../models/User";

export const getUser: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: { name: string; email: string } = {
      name: "Test User",
      email: "test@email.com",
    };

    res.status(200).json(user);
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
    const { name, password, fullName, age, email } = req.body;
    const user = new UserModel();

    res.send();
  } catch (err) {
    next(err);
  }
};

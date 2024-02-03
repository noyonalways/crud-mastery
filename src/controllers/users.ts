import { NextFunction, Request, RequestHandler, Response } from "express";

const getUser: RequestHandler = async (
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

export = {
  getUser,
};

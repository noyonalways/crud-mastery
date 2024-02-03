import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import baseRoutes from "./routes";
import { CustomError, ErrorResponse } from "./error";
import appRoutes from "../routes";

const app: Application = express();
app.use([morgan("dev")], cors(), express.json());
app.use(baseRoutes);
app.use(appRoutes);

// Not found handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new ErrorResponse(false, "Not Found", {
    code: 404,
    description: "Page not found",
  });

  next(error);
});

// Global error handler middleware
app.use(
  (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    console.log(err);
    const message: string = err.message ? err.message : "Server Error";
    const code: number = err.error?.code || 500;
    const description: string =
      err.error?.description || "Internal Server Error";
    const response = new ErrorResponse(false, message, {
      code,
      description,
    });

    res.status(code).json(response);
  }
);

// Example route

export default app;

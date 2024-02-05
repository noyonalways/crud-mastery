import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrderValidationSchema } from "../validation/orders";
import {
  addOrderIntoDB,
  findUserByProperty,
  getOrderFromDB,
} from "../services/users";
import { ErrorResponse } from "../app/error";

export const addOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const orderInfo = req.body;

    const user = await findUserByProperty("userId", userId);
    if (!user) {
      throw new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User font found",
      });
    }

    const validationData = OrderValidationSchema.safeParse({ ...orderInfo });

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

    const _order = await addOrderIntoDB(Number(userId), {
      ...validationData.data,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedOrder: any = await getOrderFromDB(Number(userId));

    console.log();
    res.status(200).json({
      success: true,
      message: "Order added successfully",
      data: updatedOrder.orders[updatedOrder.orders.length - 1],
    });
  } catch (err) {
    next(err);
  }
};

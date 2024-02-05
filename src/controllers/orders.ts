import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrderValidationSchema } from "../validation/orders";
import {
  addOrderIntoDB,
  findUserByProperty,
  getOrderFromDB,
  getTotalPriceFromDB,
} from "../services/users";
import { ErrorResponse } from "../app/error";

// add order
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
        description: "User not found",
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

// Get all orders by userId
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await findUserByProperty("userId", userId);
    if (!user) {
      throw new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User font found",
      });
    }
    const orders = await getOrderFromDB(Number(userId));
    if (!orders) {
      throw new ErrorResponse(false, "Not found", {
        code: 404,
        description: "No order found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// Calculate total price
export const getTotalPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await findUserByProperty("userId", userId);
    if (!user) {
      throw new ErrorResponse(false, "Not found", {
        code: 404,
        description: "User font found",
      });
    }

    const result = await getTotalPriceFromDB(Number(userId));

    res.status(200).json({
      success: true,
      message: "Total price calculated successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

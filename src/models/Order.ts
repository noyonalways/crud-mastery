import { Schema, model, Document } from "mongoose";

export interface Order extends Document {
  productName: string;
  price: number;
  quantity: number;
}

const orderSchema = new Schema<Order>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderModel = model<Order>("Order", orderSchema);

export default OrderModel;

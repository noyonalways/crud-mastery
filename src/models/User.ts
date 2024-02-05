import { Schema, model, Document, Types } from "mongoose";
import { Order } from "./Order";
import bcrypt from "bcryptjs";

export interface User extends Document {
  userId: number;
  username: string;
  password: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    country: string;
  };
  orders: Types.DocumentArray<Order>;
}

const counterSchema = new Schema<{ value: number }>({
  value: { type: Number, default: 0 },
});

const CounterModel = model("Counter", counterSchema);

const getNextUserId = async () => {
  const counter = await CounterModel.findOneAndUpdate(
    {},
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

export type TOrder = {
  productName?: string;
  price?: number;
  quantity?: number;
};

//create order schema
const OrderSchema = new Schema<TOrder>({
  productName: { type: String },
  price: { type: Number, min: 0 },
  quantity: { type: Number, min: 1 },
});

const userSchema = new Schema<User>(
  {
    userId: { type: Number, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
      // Add a custom error message for unique validation
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const existingUser = await UserModel.findOne({ username: value });
          if (existingUser) {
            throw new Error(
              "Username must be unique. The provided username is already taken."
            );
          }

          return true;
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const existingUser = await UserModel.findOne({ email: value });
          if (existingUser) {
            throw new Error("User already Exist");
          }
          return true;
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hobbies: {
      type: [String],
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    orders: {
      type: [OrderSchema],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<User>("save", async function (next) {
  if (!this.userId) {
    this.userId = await getNextUserId();
  }
  next();
});

userSchema.pre<User>("save", async function (next) {
  // Hash the password only if it is modified or new
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Explicitly specify the type of error
      return next(error);
    }
  }
  next();
});

const UserModel = model<User>("User", userSchema);

export default UserModel;

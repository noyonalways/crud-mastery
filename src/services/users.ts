import { ErrorResponse } from "../app/error";
import UserModel from "../models/User";

interface CreateUserProperties {
  username: string;
  password: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  age: number;
  email: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  orders?: [
    {
      productName: string;
      price: number;
      quantity: number;
    }
  ];
  hobbies?: [string];
}

export const createNewUser = (userInput: CreateUserProperties) => {
  const user = new UserModel({
    username: userInput.username,
    password: userInput.password,
    fullName: {
      firstName: userInput.fullName.firstName,
      lastName: userInput.fullName.lastName,
    },
    age: userInput.age,
    email: userInput.email,
    address: {
      street: userInput.address?.street,
      city: userInput.address?.city,
      country: userInput.address?.country,
    },
  });

  return user.save();
};

export const findUserByProperty = (key: string, value: string | number) => {
  if (key === "_id") {
    return UserModel.findById(value);
  }
  return UserModel.findOne({ [key]: value });
};

export const findUsers = () => {
  return UserModel.find();
};

export const updateUserPut = async (
  userId: number | string,
  data: CreateUserProperties
) => {
  const user = await findUserByProperty("email", data.email);
  if (user) {
    const customError = new ErrorResponse(false, "Email already in use", {
      code: 400,
      description: "Email already in use",
    });
    throw customError;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userWithId: any = await findUserByProperty("userId", userId);

  return UserModel.findByIdAndUpdate(
    userWithId._id,
    { ...data },
    { new: true }
  );
};

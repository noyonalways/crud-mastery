import { ErrorResponse } from "../app/error";
import UserModel from "../models/User";
import {
  UpdateUserValidationProperties,
  UserValidationProperties,
} from "../validation/users";

// Create a new user
export const createNewUser = (userInput: UserValidationProperties) => {
  const user = new UserModel({ ...userInput });
  return user.save();
};

// Find upser by property
export const findUserByProperty = (
  key: string,
  value: string | number | undefined
) => {
  if (key === "_id") {
    return UserModel.findById(value);
  }
  return UserModel.findOne({ [key]: value });
};

export const findUsers = () => {
  return UserModel.find(
    {},
    { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
  );
};

// Updater user
export const updateUserPut = async (
  userId: number | string,
  data: UpdateUserValidationProperties
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
  if (!userWithId) {
    const customError = new ErrorResponse(false, "User not found", {
      code: 404,
      description: "User not found",
    });
    throw customError;
  }

  // Update the user's information, excluding the password
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedUser: any = await UserModel.findByIdAndUpdate(
    userWithId._id,
    { ...data },
    { new: true }
  );

  // Exclude the password from the returned user
  const { password, ...userWithoutPassword } = updatedUser.toObject();

  return userWithoutPassword;
};

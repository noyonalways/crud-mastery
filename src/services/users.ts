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

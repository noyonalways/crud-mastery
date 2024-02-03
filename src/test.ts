import { z } from "zod";
import Joi from "joi";
const _z = z;
/* const zodSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  birthday: z.string(),
});

type User = z.infer<typeof zodSchema>;

const data: User = {
  name: "Noyon Rahman",
  email: "noyonrahman.dev@gmail.com",
  password: "pass123",
  birthday: "15-02-2003",
};

console.log(zodSchema.safeParse(data));
 */

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref("password"),
  birthday: Joi.string().required(),
});

const user = {
  name: "Noyon Rahman",
  email: "noyonrahman.dev@gmail.com",
  password: "pass123",
  confirmPassword: "pass123",
  birthday: 1255,
};

const { error, value } = joiSchema.validate(user, { abortEarly: false });
console.log(value, error);

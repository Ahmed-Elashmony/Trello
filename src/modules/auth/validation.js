import joi from "joi";

export const SignUp = joi
  .object({
    userName: joi.string().alphanum().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .min(8)
      .max(50)
      .required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    age: joi.number().integer().positive().min(18).max(60),
    gender: joi.string().valid("male", "female"),
    phone: joi.string().empty(""),
  })
  .required();

export const logIn = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const changePassword = joi
  .object({
    oldPassword: joi.string().min(8).max(50).required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .min(8)
      .max(50)
      .required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

import joi from "joi";

export const update = joi
  .object({
    userName: joi.string().alphanum().min(2).max(30).required(),
    age: joi.number().integer().min(18).max(60).required(),
    phone: joi.string(),
  })
  .required();

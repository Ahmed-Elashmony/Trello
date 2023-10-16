import joi from "joi";

const todayDate = new Date();

export const addTask = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  deadline: joi.date().min(todayDate).iso().required(),
  assignTo: joi.string().required(),
});

export const updateTask = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  deadline: joi.date().min(todayDate).iso().required(),
  assignTo: joi.string().required(),
  status: joi.string().valid("toDo", "Done", "Doing").required(),
  taskID: joi.string().required(), // params
});

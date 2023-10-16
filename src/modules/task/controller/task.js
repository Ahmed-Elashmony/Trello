import taskModel from "../../../../DB/Model/task.model.js";
import userModel from "../../../../DB/Model/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addTask = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, assignTo } = req.body;
  const checkAssign = await userModel.findById(assignTo);
  if (!checkAssign) {
    return next(new Error("user who assign to him not found", { casue: 404 }));
  }
  const task = await taskModel.create({
    title,
    description,
    deadline,
    assignTo,
    userId: req.user.id,
  });
  return res.status(200).json({ message: "Done", task });
});

export const allTask = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel
    .find()
    .populate([
      { path: "userId", select: "-_id userName email" },
      { path: "assignTo" },
    ]);
  return res.status(200).json({ message: "Done", tasks });
});

export const getAllCreatedTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ userId: req.user.id });
  return res.status(200).json({ message: "Done", tasks });
});

export const getAllAssignTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ assignTo: req.user.id });
  return res.status(200).json({ message: "Done", tasks });
});

export const allLateTasks = asyncHandler(async (req, res, next) => {
  const dateToday = new Date();
  const tasks = await taskModel.find({ deadline: { $lt: dateToday } });
  return res.status(200).json({ message: "Done", tasks });
});

export const getUserWhoseTask = asyncHandler(async (req, res, next) => {
  const { taskID } = req.params;
  const task = await taskModel.findById(taskID);
  const user = await userModel.findById(task.assignTo);
  return res.status(200).json({ message: "Done", user });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, assignTo, status } = req.body;
  const { taskID } = req.params;
  const checkAssign = await userModel.findById(assignTo);
  if (!checkAssign) {
    return next(new Error("user who assign to him not found", { casue: 404 }));
  }
  const checkTask = await taskModel.findById(taskID);
  if (req.user.id != checkTask.userId) {
    return next(new Error("U Havnt The Access", { casue: 400 }));
  }
  const task = await taskModel.updateOne(
    { _id: taskID },
    {
      title,
      description,
      deadline,
      assignTo,
      status,
    },
    { new: true }
  );
  return res.status(200).json({ message: "Done", task });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { taskID } = req.params;
  const checkTask = await taskModel.findById(taskID);
  if (req.user.id != checkTask.userId) {
    return next(new Error("U Havnt The Access", { casue: 400 }));
  }
  const task = await taskModel.updateOne({ _id: taskID }, { isDeleted: true });
  return res.status(200).json({ message: "Done", task });
});

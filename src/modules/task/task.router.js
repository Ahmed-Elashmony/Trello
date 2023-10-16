import auth from "../../middelware/authtication.js";
import { validation } from "../../middelware/valdiation.js";
import * as taskController from "./controller/task.js";
import * as validators from "./validation.js";
import { Router } from "express";
const router = Router();

router.post(
  "/addTask",
  auth,
  validation(validators.addTask),
  taskController.addTask
);

router.get("/allTask", taskController.allTask);

router.get("/getAllCreatedTasks", auth, taskController.getAllCreatedTasks);

router.get("/getAllAssignTasks", auth, taskController.getAllAssignTasks);

router.get("/allLateTasks", auth, taskController.allLateTasks);

router.get("/getUserWhoseTask/:taskID", auth, taskController.getUserWhoseTask);

router.put(
  "/updateTask/:taskID",
  auth,
  validation(validators.updateTask),
  taskController.updateTask
);

router.delete("/deleteTask/:taskID", auth, taskController.deleteTask);

export default router;

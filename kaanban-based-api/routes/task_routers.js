import express from "express";
import ROUTE_NAMES from "../utils/route_name.js";
import { addTask, deleteTask, findAllTasks, updateTask,findTaskById } from "../controller/task_controller.js";
const taskRouter = express.Router();
taskRouter.get(ROUTE_NAMES.TASK, findAllTasks);
taskRouter.post(ROUTE_NAMES.TASK_ADD, addTask);
taskRouter.post(ROUTE_NAMES.TASK_UPDATE, updateTask);
taskRouter.delete(ROUTE_NAMES.TASK_DELETE, deleteTask);
taskRouter.get(ROUTE_NAMES.TASK_BY_ID,findTaskById)


export default taskRouter;
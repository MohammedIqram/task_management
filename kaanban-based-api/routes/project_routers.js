import express from "express";
import ROUTE_NAMES from "../utils/route_name.js";
import { addProject, deleteProject, findProjectsByOwnerId, updateProject,findProjectById } from "../controller/project_controller.js";
const projectRouter = express.Router();
projectRouter.get(ROUTE_NAMES.PROJECT, findProjectsByOwnerId);
projectRouter.post(ROUTE_NAMES.PROJECT_ADD, addProject);
projectRouter.post(ROUTE_NAMES.PROJECT_UPDATE, updateProject);
projectRouter.delete(ROUTE_NAMES.PROJECT_DELETE, deleteProject);
projectRouter.get(ROUTE_NAMES.PROJECT_BY_ID, findProjectById);


export default projectRouter;
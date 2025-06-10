// routes/user_routers.js
import express from "express";
import ROUTE_NAMES from "../utils/route_name.js";
// Import the new login function
import { addUser, deleteUser, findAllUsers, updateUser, findUserById, login } from "../controller/user_controller.js";

const userRouter = express.Router();

userRouter.get(ROUTE_NAMES.USER, findAllUsers);
userRouter.post(ROUTE_NAMES.USERS_ADD, addUser); // This can also be considered a register endpoint
userRouter.post(ROUTE_NAMES.USERS_UPDATE, updateUser);
userRouter.delete(ROUTE_NAMES.USERS_DELETE, deleteUser);
userRouter.get(ROUTE_NAMES.USER_FIND_BY_ID, findUserById);
userRouter.post(ROUTE_NAMES.LOGIN, login);

export default userRouter;
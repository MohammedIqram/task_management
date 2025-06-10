import express from "express";
import ROUTE_NAMES from "../utils/route_name.js";
import multer from 'multer';
import path from 'path';
import FS from "fs";
import { findAllColumns, deleteColumn, addColumn, updateColumn,findColumnById } from "../controller/column_controller.js";
const columnRouter = express.Router();


columnRouter.get(ROUTE_NAMES.COLUMN, findAllColumns);
columnRouter.post(ROUTE_NAMES.COLUMN_ADD, addColumn);
columnRouter.post(ROUTE_NAMES.COLUMN_UPDATE, updateColumn);
columnRouter.delete(ROUTE_NAMES.COLUMN_DELETE, deleteColumn);
columnRouter.get(ROUTE_NAMES.COLUMN_BY_ID, findColumnById);


export default columnRouter;
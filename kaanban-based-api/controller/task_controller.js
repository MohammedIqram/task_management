import { MESSAGES, RESPONSE_CODES } from '../utils/constant.js';
import { MODELS } from "../config/config.js";
import { ServerResponse } from "../utils/helper.js";

export const findAllTasks = async (req, res) => {
  
  const columnId = req.query.column_id || req.body.column_id;
  if (!columnId) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID and Column ID are required to fetch tasks.");
  }

  try {
    const data = await MODELS.TASKS.findAll({
      where: { column_id: columnId}, 
    });
    return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.TASK_SEARCH_SUCCESS, data);
  } catch (err) {
    console.error("Error in findAllTasks:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const addTask = async (req, res) => {
  let body = req.body;
  if (!body.title || !body.column_id) { // Ensure all required fields are present
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Task title, column ID, and project ID are required.");
  }
  // No need for delete body.id if using auto-increment
  try {
    const data = await MODELS.TASKS.create(body);
    return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Task added successfully", data);
  } catch (err) {
    console.error("Error in addTask:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const updateTask = async (req, res) => {
  let body = req.body;
  // Ensure ID, and project_id are present for a scoped update
  if (!body.id) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Task ID and project ID are required for update.");
  }

  try {
    const [effectedRows] = await MODELS.TASKS.update(body, {
      where: { id: body.id} 
    });
    if (effectedRows > 0) {
      return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Task updated successfully");
    } else {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Task not found or does not belong to this project.");
    }
  } catch (err) {
    console.error("Error in updateTask:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const deleteTask = async (req, res) => {
  const id = req.params.id; 
  if (!id) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Task ID and project ID are required for deletion.");
  }

  try {
    const effectedRows = await MODELS.TASKS.destroy({
      where: { id: id} // Scope by project_id
    });
    if (effectedRows > 0) {
      return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Task deleted successfully");
    } else {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Task not found or does not belong to this project.");
    }
  } catch (err) {
    console.error("Error in deleteTask:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const findTaskById = async (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Task ID and Project ID are required.");
  }

  try {
    const task = await MODELS.TASKS.findOne({ 
      where: { id: id}, 
    });
    if (!task) {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Task not found or does not belong to this project.");
    }
    return ServerResponse(
      res,
      RESPONSE_CODES.SUCCESS,
      MESSAGES.SEARCH_SUCCESS,
      task
    );
  } catch (err) {
    console.error("Error in findTaskById:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};
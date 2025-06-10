import crypto from "crypto";
import { MESSAGES, RESPONSE_CODES } from '../utils/constant.js';
import { MODELS } from "../config/config.js";
import { ServerResponse } from "../utils/helper.js";

export const findAllColumns = async (req, res) => {
  const projectId = req.query.project_id;
    if (!projectId) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID is required to fetch columns.");
  }
  try {
    const data = await MODELS.COLUMN.findAll({
      where: { project_id : projectId }, 
    });
    return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.COLUMN_SEARCH_SUCCESS, data);
  } catch (err) {
    console.error("Error in findAllColumns:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const findAllColumnsWithTasks = async (req, res) => {
  const projectId = req.query.project_id || req.body.project_id; // Get project_id from query or body

  if (!projectId) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID is required to fetch columns and tasks.");
  }

  try {
    const columnsWithTasks = await MODELS.COLUMN.findAll({
      where: { project_id: projectId },
      // Include the associated Tasks
      include: [{
        model: MODELS.TASKS,
        as: 'tasks', 
      }],
    });

    return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.COLUMN_SEARCH_SUCCESS, columnsWithTasks);
  } catch (err) {
    console.error("Error in findAllColumnsWithTasks:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const addColumn = async (req, res) => {
  let body = req.body;
  console.log('body.name=',body.name)
  console.log('body.projectId=',body.project_id)
  if (!body.name || !body.project_id) { 
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Column name and project ID are required.");
  }
  // No need for delete body.id if you're using auto-increment
  try {
    const data = await MODELS.COLUMN.create(body);
    return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Column added successfully", data); // Return data for frontend
  } catch (err) {
    console.error("Error in addColumn:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

// Update a store by the id in the request
export const updateColumn = async (req, res) => {
  let body = req.body;
  // Ensure ID, name, and project_id are present for a scoped update
  if (!body.id || !body.name || !body.project_id) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Column ID, name, and project ID are required for update.");
  }

  try {
    const [effectedRows] = await MODELS.COLUMN.update(
      { name: body.name, orders: body.orders }, // Only update relevant fields
      { where: { id: body.id, project_id : body.project_id } } // Scope by project_id
    );
    if (effectedRows > 0) {
      return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Column updated successfully");
    } else {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Column not found or does not belong to this project.");
    }
  } catch (err) {
    console.error("Error in updateColumn:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const deleteColumn = async (req, res) => {
  const id = req.params.id; // Get ID from params
  const projectId = req.body.project_id; // Expect project_id in body for security/scoping

  if (!id || !projectId) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Column ID and project ID are required for deletion.");
  }

  try {
    const effectedRows = await MODELS.COLUMN.destroy({
      where: { id: id, project_id : projectId } // Scope by project_id
    });
    if (effectedRows > 0) {
      return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Column deleted successfully");
    } else {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Column not found or does not belong to this project.");
    }
  } catch (err) {
    console.error("Error in deleteColumn:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};

export const findColumnById = async (req, res) => {
  const id = req.params.id;
  const projectId = req.query.projectId;

  if (!id || !projectId) {
    return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Column ID and Project ID are required.");
  }

  try {
    const column = await MODELS.COLUMN.findOne({ // Use findOne for single record
      where: { id: id, project_id: projectId }, // Scope by project_id
      // attributes: { exclude: ['accToken', 'refToken'] }, // This is typically for User model
    });
    if (!column) {
      return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Column not found or does not belong to this project.");
    }
    return ServerResponse(
      res,
      RESPONSE_CODES.SUCCESS,
      MESSAGES.SEARCH_SUCCESS,
      column
    );
  } catch (err) {
    console.error("Error in findColumnById:", err);
    return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
  }
};
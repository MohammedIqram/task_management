import { MESSAGES, RESPONSE_CODES } from '../utils/constant.js';
import { MODELS } from "../config/config.js";
import { ServerResponse } from "../utils/helper.js";

// This function is used by ProjectDashboard to get all projects for an owner
export const findProjectsByOwnerId = async (req, res) => {
    console.log('\n req.params.ownerId=',req.params.ownerId);
    const ownerId = req.params.ownerId || req.query.owner_id; 

    if (!ownerId) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Owner ID is missing.");
    }

    try {
        const projects = await MODELS.PROJECTS.findAll({
            where: { owner_id: ownerId },
            order: [['id', 'ASC']] // Order projects by ID for consistent display
            // You can include columns and tasks here if you want to fetch them eagerly
            // include: [{ model: MODELS.Column, as: 'columns', include: [{ model: MODELS.Task, as: 'tasks' }] }]
        });

        if (!projects || projects.length === 0) {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "No projects found for this user.", []);
        }

        return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.SEARCH_SUCCESS, projects);

    } catch (err) {
        console.error('Error fetching projects by owner:', err);
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
};

// This function is used by the new 'getProjectDetails' WebSocket message
export const findProjectById = async (req, res) => {
    const owner_id = req.params.id; // Get project ID from params or query
    console.log('ownerId=',owner_id)
    if (!owner_id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID is missing.");
    }

    try {
        const projects = await MODELS.PROJECTS.findAll({
            where: { owner_id: owner_id },
        });

        if (!projects) {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Project not found.");
        }

        return ServerResponse(
            res,
            RESPONSE_CODES.SUCCESS,
            MESSAGES.SEARCH_SUCCESS,
            projects
        );
    } catch (err) {
        console.error("Error in findProjectById:", err);
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
};


export const addProject = async (req, res) => {
    const { name, owner_id } = req.body; // Expect name and owner_id from frontend

    if (!name || !owner_id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project name and owner ID are required.");
    }

    try {
        const newProject = await MODELS.PROJECTS.create({ name, owner_id });

        // --- Automatically create default columns for the new project ---
        const defaultColumns = [
            { name: 'To Do', project_id: newProject.id, orders: '1' },
            { name: 'In Progress', project_id: newProject.id, orders: '2' },
            { name: 'Completed', project_id: newProject.id, orders: '3' },
        ];
        await MODELS.COLUMN.bulkCreate(defaultColumns);
        // --- End default column creation ---

        return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Project added successfully with default columns.", newProject);
    } catch (err) {
        console.error("Error in addProject:", err);
        // Consider transaction rollback here if column creation fails
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
};


export const updateProject = async (req, res) => {
    let body = req.body;
    
    if (!body.id || !body.owner_id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID and owner ID are required for update.");
    }

    try {
        const [effectedRows] = await MODELS.PROJECTS.update(body, {
            where: { id: body.id, owner_id: body.owner_id } // Scope by owner_id
        });
        if (effectedRows > 0) {
            return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Project updated successfully");
        } else {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Project not found or does not belong to this owner.");
        }
    } catch (err) {
        console.error("Error in updateProject:", err);
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
};

export const deleteProject = (req, res) => {
    const id = req.params.id; 
    
    if (!id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Project ID is missing.");
    }

    try {
        const effectedRows = MODELS.PROJECTS.destroy({
            where: { id: id }
        });
        if (effectedRows > 0) {
            return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Project deleted successfully");
        } else {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Project not found.");
        }
    } catch (err) {
        console.error("Error in deleteProject:", err);
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
};
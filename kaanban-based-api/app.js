import userRouter from "./routes/user_routers.js";
import express from "express";
import { CONSTANTS, MESSAGES, RESPONSE_CODES } from "./utils/constant.js";
import ROUTE_NAMES from "./utils/route_name.js";
import cors from 'cors';
import dotenv from 'dotenv';
import { ServerResponse } from "./utils/helper.js"; 
import path from "path"; 
import taskRouter from "./routes/task_routers.js"; 
import columnRouter from './routes/column_routers.js'; 
import projectRouter from './routes/project_routers.js';
import { WebSocketServer } from 'ws';
import { MODELS } from './config/config.js';

// Import individual controller functions needed for WebSocket handling
import { findAllColumnsWithTasks , addColumn, updateColumn, deleteColumn } from './controller/column_controller.js';
import { findAllTasks, addTask, updateTask, deleteTask } from './controller/task_controller.js';
import { findProjectsByOwnerId, addProject } from './controller/project_controller.js'; // findProjectsByOwnerId is for ProjectDashboard

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all(ROUTE_NAMES.BASE, (req, res) => {
    return res.json({ statusCode: RESPONSE_CODES.SUCCESS, message: MESSAGES.WELCOME });
});

// Express HTTP routers (These are separate from WebSocket handling)
app.use(ROUTE_NAMES.BASE, userRouter);
app.use(ROUTE_NAMES.BASE, taskRouter);
app.use(ROUTE_NAMES.BASE, columnRouter);
app.use(ROUTE_NAMES.BASE, projectRouter);

// If no HTTP route matched
app.all('*', function (req, res) {
    ServerResponse(res, RESPONSE_CODES.NOT_FOUND, MESSAGES.NO_ROUT_FOUND);
});

const server = app.listen(CONSTANTS.PORT, function () {
    console.log(`Express server listening on port ${CONSTANTS.PORT}`);
});

// WebSocket Server Setup
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('Client connected to WebSocket');

    ws.on('message', async message => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log('Received message:', parsedMessage);

            // Create a mock res object for controllers to use
            // This mockRes will send data back to the specific client (ws.send)
            // For broadcasting to all clients (e.g., after an update), you'll use wss.clients.forEach
            const mockRes = {
                json: (data) => {
                    ws.send(JSON.stringify({
                        type: mockRes.dataType,
                        statusCode: mockRes.statusCode,
                        message: data?.message || mockRes.statusMessage, 
                        data: data?.data || data 
                    }));
                },
                status: (code) => {
                    mockRes.statusCode = code;
                    return mockRes;
                },
                  // but if ServerResponse is always used, 'json' will be called.
                send: (data) => {
                    ws.send(JSON.stringify({
                        type: mockRes.dataType,
                        statusCode: mockRes.statusCode,
                        message: data?.message || mockRes.statusMessage,
                        data: data?.data || data
                    }));
                },
                statusCode: 200, 
                statusMessage: "OK",
                dataType: 'default' 
            };

            const mockReq = {
                params: {}, 
                body: parsedMessage.payload || {}, 
                query: {}, 
            };

            if (parsedMessage.projectId) {
                mockReq.query.project_id = parsedMessage.projectId;
                mockReq.body.project_id = parsedMessage.projectId; 
            }
            if (parsedMessage.columnId) {
                mockReq.query.column_id = parsedMessage.columnId;
                mockReq.body.column_id = parsedMessage.columnId; 
            }
            
            if (parsedMessage.payload && parsedMessage.payload.id) {
                mockReq.params.id = parsedMessage.payload.id;
            }


            switch (parsedMessage.type) {
                // --- Project Details (New) ---
                case 'getProjectDetails':
                    if (!parsedMessage.projectId) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Project ID is required for getProjectDetails.");
                    }
                    try {
                        // Directly query the Project model as it's a simple fetch
                        const project = await MODELS.PROJECTS.findByPk(parsedMessage.projectId);
                        if (project) {
                            mockRes.dataType = 'getProjectDetails';
                            ServerResponse(mockRes, RESPONSE_CODES.SUCCESS, MESSAGES.SEARCH_SUCCESS, project);
                        } else {
                            mockRes.dataType = 'error';
                            ServerResponse(mockRes, RESPONSE_CODES.NOT_FOUND, "Project not found.");
                        }
                    } catch (err) {
                        console.error('Error fetching project details:', err);
                        mockRes.dataType = 'error';
                        ServerResponse(mockRes, RESPONSE_CODES.ERROR, "Failed to fetch project details.", err);
                    }
                    break;
                    case 'getColumnsWithTasks':
                    try {
                        const projectId = parsedMessage.projectId;
                        if (!projectId) {
                            mockRes.dataType = 'error'; // Set dataType for the response
                            ws.send(JSON.stringify({ type: 'error', message: 'Project ID is required.', statusCode: 400 }));
                            return;
                        }

                        // Directly use Sequelize's include method for efficiency
                        const columnsWithTasks = await MODELS.COLUMN.findAll({
                            where: { project_id: projectId },
                            include: [{
                                model: MODELS.TASKS,
                                as: 'tasks', 
                            }],
                        });

                        // Send the structured data back to the client
                        ws.send(JSON.stringify({ type: 'getColumnsWithTasks', data: columnsWithTasks, statusCode: 200 }));
                    } catch (error) {
                        console.error('Error fetching columns with tasks:', error);
                        ws.send(JSON.stringify({ type: 'error', message: 'Internal server error.', statusCode: 500 }));
                    }
                    break;

                case 'addColumn':
                    if (!parsedMessage.payload || !parsedMessage.payload.name || !parsedMessage.payload.project_id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Column name and project ID are required.");
                    }
                    mockRes.dataType = 'addColumn';
                    const addColumnReqBody = {
                    name: parsedMessage.payload.name,
                    project_id: parsedMessage.payload.project_id,
                    orders: parsedMessage.payload.orders 
                };
                mockReq.body = addColumnReqBody; 
                await addColumn(mockReq, mockRes);
                break;

                case 'updateColumn':
                    if (!parsedMessage.payload || !parsedMessage.payload.id || !parsedMessage.payload.name || !parsedMessage.payload.project_id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Column ID, name, and project ID are required for updateColumn.");
                    }
                    mockRes.dataType = 'updateColumn';
                    await updateColumn(mockReq, mockRes);
                    break;

                case 'deleteColumn':
                    if (!parsedMessage.payload || !parsedMessage.payload.id || !parsedMessage.payload.project_id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Column ID and project ID are required for deleteColumn.");
                    }
                    mockRes.dataType = 'deleteColumn';
                    await deleteColumn(mockReq, mockRes);
                    break;

                // --- Tasks ---
                case 'getTasks':
                    if (!parsedMessage.columnId) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Column ID and Project ID are required for getTasks.");
                    }
                    // Adapt mockReq for findAllTasks to filter by column_id and project_id
                    mockReq.query.column_id = parsedMessage.columnId;
                    console.log('getTasks method parsedMessage.projectId=',parsedMessage.columnId)
                    mockRes.dataType = 'getTasks';
                    await findAllTasks(mockReq, mockRes);
                    break;

                case 'addTask':
                    if (!parsedMessage.payload || !parsedMessage.payload.title || !parsedMessage.payload.column_id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Task title, column ID, and project ID are required for addTask.");
                    }
                    mockRes.dataType = 'addTask';
                    await addTask(mockReq, mockRes);
                    break;

                case 'updateTask':
                    if (!parsedMessage.payload || !parsedMessage.payload.id ) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Task ID, project ID, and update data are required for updateTask.");
                    }
                    console.log('on update= parsedMessage.payload=',parsedMessage.payload)
                    mockRes.dataType = 'updateTask';
                    await updateTask(mockReq, mockRes);
                    break;

                case 'deleteTask':
                    if (!parsedMessage.payload || !parsedMessage.payload.id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Task ID and project ID are required for deleteTask.");
                    }
                    mockRes.dataType = 'deleteTask';
                    await deleteTask(mockReq, mockRes);
                    break;

                // --- Other cases like user management could be added here if needed via WS ---
                // For example, if you wanted to add a project from WS (not just HTTP)
                case 'addProject':
                    if (!parsedMessage.payload || !parsedMessage.payload.name || !parsedMessage.payload.owner_id) {
                        mockRes.dataType = 'error';
                        return ServerResponse(mockRes, RESPONSE_CODES.MISSING_DATA, "Project name and owner ID are required.");
                    }
                    mockRes.dataType = 'addProject';
                    await addProject(mockReq, mockRes);
                    break;

                default:
                    ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type', statusCode: 400 }));
            }
        } catch (error) {
            console.error('WebSocket message processing error:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message', details: error.message, statusCode: 500 }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server started');

export default app;
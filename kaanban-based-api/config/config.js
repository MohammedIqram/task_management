import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import Users from '../module/users.js';
import TASKS from '../module/task.js';
import PROJECTS from '../module/project.js';
import COLUMN from '../module/column.js';
import tASKUSERS from '../module/task_users.js';

dotenv.config();
console.log(
    'DB', process.env.DB_NAME,
    'user ', process.env.USER,
    'password', process.env.PASSWORD,
);
const SEQUELIZE = new Sequelize(
    process.env.DB_NAME,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        pool: 5,
        logging: false,
        pool: { 
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }

);

const MODELS = {
    User: Users(SEQUELIZE, Sequelize),
    TASKS: TASKS(SEQUELIZE, Sequelize),
    PROJECTS: PROJECTS(SEQUELIZE,Sequelize),
    COLUMN: COLUMN(SEQUELIZE, Sequelize),
    tASKUSERS: tASKUSERS(SEQUELIZE, Sequelize),
};

Object.keys(MODELS).forEach(modelName => {
  if (MODELS[modelName].associate) {
    MODELS[modelName].associate(MODELS);
  }
});

// const MODELS = {}; // Initialize as empty object

// // Initialize models: Pass SEQUELIZE and DataTypes to each model function
// // Use singular PascalCase for MODEL object keys for consistency with associations
// MODELS.User = Users(SEQUELIZE); // Users model does not need DataTypes as per its definition
// MODELS.Project = PROJECTS(SEQUELIZE, DataTypes);
// MODELS.Column = COLUMN(SEQUELIZE, DataTypes);
// MODELS.Task = TASKS(SEQUELIZE, DataTypes);
// MODELS.TaskUser = tASKUSERS(SEQUELIZE, DataTypes); // Corrected from tASKUSERS

// // --- Add your associations here, after all models are initialized ---

// // User has many Projects
// MODELS.User.hasMany(MODELS.Project, { foreignKey: 'owner_id', as: 'ownedProjects' });
// MODELS.Project.belongsTo(MODELS.User, { foreignKey: 'owner_id', as: 'owner' });

// // Project has many Columns
// MODELS.Project.hasMany(MODELS.Column, { foreignKey: 'project_id', as: 'columns' });
// MODELS.Column.belongsTo(MODELS.Project, { foreignKey: 'project_id', as: 'project' });

// // Column has many Tasks
// MODELS.Column.hasMany(MODELS.Task, { foreignKey: 'column_id', as: 'tasks' });
// MODELS.Task.belongsTo(MODELS.Column, { foreignKey: 'column_id', as: 'column' });

// // Optional: Task and User many-to-many through TaskUser
// // Assuming your TaskUser model correctly defines the through table
// MODELS.Task.belongsToMany(MODELS.User, { through: MODELS.TaskUser, foreignKey: 'task_id', as: 'assignedUsers' });
// MODELS.User.belongsToMany(MODELS.Task, { through: MODELS.TaskUser, foreignKey: 'user_id', as: 'assignedTasks' });


// // Sync models (only in development, use migrations for production)
// SEQUELIZE.sync({ alter: true }) // 'alter: true' will try to make changes to match models
//   .then(() => {
//     console.log('Database & tables synced!');
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

export { SEQUELIZE,MODELS };

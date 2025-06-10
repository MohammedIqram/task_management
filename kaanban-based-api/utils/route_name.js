const ROUTE_NAMES = {
    BASE: "/v1",

    //user
    LOGIN: "/users/login",
    ADMIN_LOGIN: "/admin/login",
   
    SIGN_UP: "/users/signup",
    ADMIN_DASHBOARD: "/admin/dashboard",
    LOGOUT: "/users/logout/:id",
    CHANGE_PASSWORD: "/users/passChange/:id",

    USER_FIND_BY_ID: "/users/:id",
    USER: "/users",
    USERS_ADD: "/users/add",
    USERS_UPDATE: "/users/update",
    USERS_DELETE: "/users/delete/:id",

    //tasks
    TASK: "/tasks",
    TASK_ADD: "/tasks/add",
    TASK_UPDATE: "/tasks/update",
    TASK_DELETE: "/tasks/delete/:id",
    TASK_BY_ID: "/tasks/:id",

    //columns
    COLUMN: "/columns",
    COLUMN_ADD: "/columns/add",
    COLUMN_UPDATE: "/columns/update",
    COLUMN_DELETE: "/columns/delete/:id",
    COLUMN_BY_ID: "/columns/:id",

    //project
    PROJECT: "/project",
    PROJECT_ADD: "/project/add",
    PROJECT_UPDATE: "/project/update",
    PROJECT_DELETE: "/project/delete/:id",
    PROJECT_BY_ID: "/project/:id",
    
};

export default Object.freeze(ROUTE_NAMES); 
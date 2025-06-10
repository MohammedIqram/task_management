// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/tasks/';

// const getTasks = () => {
//   return axios.get(API_URL);
// };

// // Add other task-related service methods here

// export default { getTasks };

const mockTasks = {
    data: [
      { id: 1, title: "Design Homepage", description: "Create mockups for the new homepage", due_date: "2025-04-15", priority: "High", column_id: 1, order: 1 },
      { id: 2, title: "Implement Navigation", description: "Develop the main website navigation", due_date: "2025-04-18", priority: "Medium", column_id: 1, order: 2 },
      { id: 3, title: "Build User Profile", description: "Create the user profile section", due_date: "2025-04-22", priority: "High", column_id: 2, order: 1 },
      { id: 4, title: "Write Blog Post", description: "Draft a new blog article", due_date: "2025-04-25", priority: "Low", column_id: 3, order: 1 },
      { id: 5, title: "Deploy to Production", description: "Deploy the latest changes to the live server", due_date: "2025-04-29", priority: "High", column_id: 3, order: 2 },
    ]
  };
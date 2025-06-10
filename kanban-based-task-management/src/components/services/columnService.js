// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/columns/';

// const getColumns = () => {
//   return axios.get(API_URL);
// };

// // Add other column-related service methods here

// const columnService = { getColumns };

// export default columnService;

const mockColumns = {
    data: [
      { id: 1, name: "To Do", project_id: 101, order: 1, tasks: [1, 2] },
      { id: 2, name: "In Progress", project_id: 101, order: 2, tasks: [3] },
      { id: 3, name: "Completed", project_id: 101, order: 3, tasks: [4, 5] },
    ]
  };
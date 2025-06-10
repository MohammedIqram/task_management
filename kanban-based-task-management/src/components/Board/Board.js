import React, { useState, useEffect, useCallback, useRef } from 'react'; // Import useRef
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { IconButton, CircularProgress, Alert } from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const BoardContainer = styled(motion.div)`
  display: flex;
  padding: 16px;
  overflow-x: auto;
  min-height: calc(100vh - 64px);
`;

const TopButtonsContainer = styled('div')`
  display: flex;
  gap: 16px;
  margin-left: 16px;
  margin-bottom: 16px;
`;

const AddColumnButton = styled(Button)`
  flex-shrink: 0;
  width: 130px !important;
  height: 50px;
`;

const AddTaskGlobalButton = styled(Button)`
  flex-shrink: 0;
  width: 130px !important;
  height: 50px;
`;

const ColumnContainer = styled(motion.div)`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  width: 300px;
  min-width: 300px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const ColumnHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TaskList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  min-height: 0;
`;

const TaskCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:active {
    cursor: grabbing;
    transform: scale(1.03);
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const taskVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

const Task = ({ task, columnId, onUpdateTask, onDeleteTask, columns }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, columnId: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriorityLevel, setEditedPriorityLevel] = useState(task.orders);
  const [editedColumnId, setEditedColumnId] = useState(task.column_id);

  const handleUpdate = () => {
    if (editedTitle.trim() || editedDescription.trim() || editedPriorityLevel.trim()) {
      onUpdateTask(task.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        orders: editedPriorityLevel,
        column_id: editedColumnId,
      });
      setIsEditing(false);
    }
  };

  return (
    <TaskCard
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#e0e0e0' : 'white',
      }}
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isEditing ? (
        <div>
          <TextField
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            fullWidth
            margin="dense"
            label="Title"
          />
          <TextField
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={2}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-task-column-label">Column</InputLabel>
            <Select
              labelId="edit-task-column-label"
              id="editedColumnId"
              value={editedColumnId}
              label="Column"
              onChange={(e) => setEditedColumnId(e.target.value)}
            >
              {columns.map((column) => (
                <MenuItem key={column.id} value={column.id}>
                  {column.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="priority-level-label">Priority Level</InputLabel>
            <Select
              labelId="priority-level-label"
              id="editedPriorityLevel"
              value={editedPriorityLevel}
              label="Priority Level"
              onChange={(e) => setEditedPriorityLevel(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Button size="small" onClick={handleUpdate}>
              Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(task.title);
                setEditedDescription(task.description);
                setEditedPriorityLevel(task.orders);
                setEditedColumnId(task.column_id);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">{task.title}</Typography>
            <div>
              <IconButton onClick={() => setIsEditing(true)}>
                <EditIcon size="small" />
              </IconButton>
              <IconButton onClick={() => onDeleteTask(task.id)}>
                <DeleteIcon size="small" />
              </IconButton>
            </div>
          </div>
          <Typography variant="caption" color="textSecondary">
            {task.description}
          </Typography>
          <Typography >
            {task.orders}
          </Typography>

        </div>
      )}
    </TaskCard>
  );
};

const Column = ({ column, moveTask, onDeleteColumn, onEditColumn, onUpdateTask, onDeleteTask, columns }) => {
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item, monitor) => {
      if (item.columnId !== column.id) {
        moveTask(item.id, item.columnId, column.id, draggedOverIndex ?? column.tasks.length);
      }
      setDraggedOverIndex(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        const dropIndex = getDropIndex(monitor.getClientOffset(), item.id, column.id, column.tasks);
        if (dropIndex !== null && dropIndex !== draggedOverIndex) {
          setDraggedOverIndex(dropIndex);
        }
      }
    },
  }));

  const getDropIndex = (clientOffset, draggedItemId, columnId, columnTasks) => {
    if (!clientOffset) return 0;

    const targetRect = document.getElementById(`column-${columnId}`)?.getBoundingClientRect();
    if (!targetRect) return 0;

    const mouseY = clientOffset.y - targetRect.top;
    const taskHeight = 60; // Approximate height of a task card
    let newIndex = Math.max(0, Math.floor(mouseY / taskHeight));

    // Adjust index if the dragged item is from the same column and moved downwards
    const draggedItemIndex = columnTasks.findIndex(t => t.id === draggedItemId);
    if (draggedItemIndex > -1 && columnId === column.id && newIndex > draggedItemIndex) {
      newIndex--;
    }
    return newIndex;
  };

  return (
    <ColumnContainer
      ref={drop}
      id={`column-${column.id}`}
      style={{
        backgroundColor: isOver && canDrop ? '#e0e0e0' : '#f0f0f0',
      }}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate="visible"
    >
      <ColumnHeader>
        <Typography variant="h6" component="h2">
          {column.name}
        </Typography>
        <div>
          <IconButton onClick={() => onEditColumn(column)}>
            <EditIcon size="small" />
          </IconButton>
          <IconButton onClick={() => onDeleteColumn(column.id)}>
            <DeleteIcon size="small" />
          </IconButton>
        </div>
      </ColumnHeader>
      <TaskList>
        <AnimatePresence>
          {column.tasks.map((task, index) => (
            <Task
              key={task.id}
              task={task}
              columnId={column.id}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              columns={columns}
            />
          ))}
        </AnimatePresence>
      </TaskList>
    </ColumnContainer>
  );
};

function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const websocketRef = useRef(null); // Use useRef for WebSocket instance
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('Loading Project...');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newPriorityLevel, setNewPriorityLevel] = useState('Low');
  const [newTaskColumnId, setNewTaskColumnId] = useState('');

  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editColumnModalOpen, setEditColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editedColumnTitle, setEditedColumnTitle] = useState('');


  const handleCloseNewTaskModal = () => {
    setNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewPriorityLevel('Low');
    setNewTaskColumnId('');
  };

  const handleCloseAddColumnModal = () => {
    setAddColumnModalOpen(false);
    setNewColumnTitle('');
  };

  const handleCloseEditColumnModal = () => {
    setEditColumnModalOpen(false);
    setEditingColumn(null);
    setEditedColumnTitle('');
  };

  useEffect(() => {
  if (!projectId) {
    setError("No project ID provided.");
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  // Close any existing WebSocket connection before opening a new one
  if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
    websocketRef.current.close();
  }

  const ws = new WebSocket('ws://localhost:8081');
  websocketRef.current = ws; // Store the WebSocket instance in a ref

  ws.onopen = () => {
    console.log('WebSocket connection established');
    ws.send(JSON.stringify({ type: 'getProjectDetails', projectId: projectId }));
    // Request columns, which should now include tasks
    ws.send(JSON.stringify({ type: 'getColumnsWithTasks', projectId: projectId })); // Changed type for clarity
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);

      if (data.statusCode && data.statusCode !== 200 && data.type !== 'error') {
        setError(data.message || 'Failed to fetch data');
        setLoading(false);
        return;
      }

      switch (data.type) {
        case 'getProjectDetails':
          if (data.data && data.data.name) {
            setProjectName(data.data.name);
          } else {
            setProjectName('Project Not Found');
          }
          break;
        case 'getColumnsWithTasks': // New case for combined data
          if (Array.isArray(data.data)) {
            const columnsWithSortedTasks = data.data.map(col => ({
              ...col,
              // Ensure tasks exist and are sorted by 'orders'
              tasks: col.tasks ? col.tasks.sort((a, b) => a.orders - b.orders) : []
            }));
            setColumns(columnsWithSortedTasks);
            setLoading(false);
          } else {
            setError('Received invalid data for columns with tasks: Expected an array.');
            setLoading(false);
          }
          break;
        case 'addTask':
        case 'updateTask':
        case 'deleteTask':
          // After any task operation, re-fetch ALL columns with their updated tasks
          // This ensures consistency across the board.
          ws.send(JSON.stringify({ type: 'getColumnsWithTasks', projectId: projectId }));
          handleCloseNewTaskModal();
          break;
        case 'addColumn':
        case 'updateColumn':
        case 'deleteColumn':
          // After any column operation, re-fetch ALL columns with their updated tasks
          ws.send(JSON.stringify({ type: 'getColumnsWithTasks', projectId: projectId }));
          handleCloseAddColumnModal();
          handleCloseEditColumnModal();
          break;
        case 'error':
          console.error('WebSocket Error:', data);
          setError(data.message || 'WebSocket error occurred');
          setLoading(false);
          break;
        default:
          console.log('Unknown WebSocket message:', data);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err);
      setError('Error processing WebSocket message. Check console for details.');
      setLoading(false);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    websocketRef.current = null;
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setError('Failed to connect to WebSocket server');
    setLoading(false);
  };

  return () => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      console.log('Cleaning up WebSocket connection...');
      websocketRef.current.close();
    }
  };
}, [projectId]); 

  // Helper to send messages via WebSocket
  const sendWebSocketMessage = useCallback((message) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
      // Optionally handle the case where WebSocket is not ready (e.g., queue message, show error)
    }
  }, []);

  const moveTask = useCallback(
    (taskId, sourceColumnId, destinationColumnId, destinationIndex) => {
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((column) => ({
          ...column,
          tasks: [...column.tasks],
        }));
        const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
        const destinationColumn = newColumns.find(
          (col) => col.id === destinationColumnId
        );

        if (!sourceColumn || !destinationColumn) {
          return prevColumns;
        }

        const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
          return prevColumns;
        }

        const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
        movedTask.column_id = destinationColumnId;
        destinationColumn.tasks.splice(destinationIndex, 0, movedTask);

        // Recalculate orders for both affected columns
        destinationColumn.tasks = destinationColumn.tasks.map((task, index) => ({
          ...task,
          orders: index + 1,
        }));
        sourceColumn.tasks = sourceColumn.tasks.map((task, index) => ({
          ...task,
          orders: index + 1,
        }));
        console.log('on move destinationColumnId=',destinationColumnId)
        console.log('on move projectId=',projectId)
        sendWebSocketMessage(
          {
            type: 'updateTask',
            payload: {
              id: taskId,
              column_id: destinationColumnId,
              // Backend might not need column_name for updates, but keeping for consistency if it does
              column_name: destinationColumn.name,
              orders: destinationColumn.tasks.find(t => t.id === taskId)?.orders,
              project_id: parseInt(projectId)
            },
          }
        );
        return newColumns;
      });
    },
    [projectId, sendWebSocketMessage]
  );

  const handleOpenNewTaskModal = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewPriorityLevel('Low');
    if (columns.length > 0) {
      setNewTaskColumnId(columns[0].id);
    } else {
      setNewTaskColumnId('');
    }
    setNewTaskModalOpen(true);
  };

  

  const handleAddTask = () => {
    if (newTaskColumnId && newTaskTitle.trim() && projectId) {
      const getColumnName = columns.find(col => col.id === newTaskColumnId)?.name;
      sendWebSocketMessage(
        {
          type: 'addTask',
          payload: {
            column_id: newTaskColumnId,
            title: newTaskTitle,
            description: newTaskDescription,
            due_date: new Date().toISOString(),
            column_name: getColumnName,
            orders: newPriorityLevel, 
          },
        }
      );
    } else {
      setError("Please provide a title, select a column, and ensure a project is selected.");
    }
  };

  const handleOpenAddColumnModal = () => {
    setAddColumnModalOpen(true);
    setNewColumnTitle('');
  };

  

  const handleAddColumn = () => {
    console.log('newColumnTitle=',newColumnTitle);
    console.log('parseInt(projectId)=',parseInt(projectId));
    if (newColumnTitle.trim() && projectId) {
      sendWebSocketMessage(
        {
          type: 'addColumn',
          payload: { name: newColumnTitle, project_id: parseInt(projectId), orders: columns.length + 1 }, // Assign an order to the new column
        }
      );
    } else {
      setError("Please provide a column title and ensure a project is selected.");
    }
  };

  const handleOpenEditColumnModal = (column) => {
    setEditingColumn(column);
    setEditedColumnTitle(column.name);
    setEditColumnModalOpen(true);
  };

  

  const handleEditColumn = () => {
    if (editingColumn && editedColumnTitle.trim()) {
      sendWebSocketMessage(
        {
          type: 'updateColumn',
          payload: { id: editingColumn.id, name: editedColumnTitle, project_id: parseInt(projectId) },
        }
      );
    }
  };

  const handleDeleteColumn = (columnId) => {
    if (projectId) {
      sendWebSocketMessage(
        {
          type: 'deleteColumn',
          payload: { id: columnId, project_id: parseInt(projectId) },
        }
      );
    }
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    if (projectId) {
      const selectedColumn = columns.find(col => col.id === updatedTask.column_id);
      const columnNameToSend = selectedColumn ? selectedColumn.name : null;

      sendWebSocketMessage({
        type: 'updateTask',
        payload: {
          id: taskId,
          title: updatedTask.title,
          description: updatedTask.description,
          orders: updatedTask.orders, 
          column_id: updatedTask.column_id,
          column_name: columnNameToSend,
          due_date: new Date().toISOString(), 
        }
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    if (projectId) {
      sendWebSocketMessage({
        type: 'deleteTask',
        payload: { id: taskId}
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading project board...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/board')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ ml: 2, mt: 2 }}>
        Project: {projectName}
      </Typography>
      <TopButtonsContainer>
        <AddColumnButton variant="outlined" onClick={handleOpenAddColumnModal}>
          Add Column
        </AddColumnButton>
        <AddTaskGlobalButton variant="contained" onClick={handleOpenNewTaskModal}
          disabled={columns.length === 0}
        >
          Add Task
        </AddTaskGlobalButton>
      </TopButtonsContainer>
      <BoardContainer>
        <AnimatePresence>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              moveTask={moveTask}
              onDeleteColumn={handleDeleteColumn}
              onEditColumn={handleOpenEditColumnModal}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              columns={columns}
            />
          ))}
        </AnimatePresence>
      </BoardContainer>

      <Dialog open={newTaskModalOpen} onClose={handleCloseNewTaskModal}>
        <DialogTitle>Add New Task to {projectName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="new-task-column-label">Column</InputLabel>
            <Select
              labelId="new-task-column-label"
              id="newTaskColumn"
              value={newTaskColumnId}
              label="Column"
              onChange={(e) => setNewTaskColumnId(e.target.value)}
            >
              {columns.map((column) => (
                <MenuItem key={column.id} value={column.id}>
                  {column.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="new-priority-level-label">Priority Level</InputLabel>
            <Select
              labelId="new-priority-level-label"
              id="newPriorityLevel"
              value={newPriorityLevel}
              label="Priority Level"
              onChange={(e) => setNewPriorityLevel(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewTaskModal}>Cancel</Button>
          <Button onClick={handleAddTask} disabled={!newTaskTitle || !newTaskColumnId}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addColumnModalOpen} onClose={handleCloseAddColumnModal}>
        <DialogTitle>Add New Column to {projectName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Column Title"
            type="text"
            fullWidth
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddColumnModal}>Cancel</Button>
          <Button onClick={handleAddColumn} disabled={!newColumnTitle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editColumnModalOpen} onClose={handleCloseEditColumnModal}>
        <DialogTitle>Edit Column in {projectName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Column Title"
            type="text"
            fullWidth
            value={editedColumnTitle}
            onChange={(e) => setEditedColumnTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditColumnModal}>Cancel</Button>
          <Button onClick={handleEditColumn} disabled={!editedColumnTitle}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}

export default Board;
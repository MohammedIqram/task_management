import React from 'react';
import Task from './Task';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDrop } from 'react-dnd';

const StyledPaper = styled(Paper)`
  margin: 16px;
  padding: 16px;
  width: 300px;
  min-height: 200px;
`;

const type = 'TASK'; 

function Column({ column, moveTask }) {
  const [{ isOver }, drop] = useDrop(() => ({ 
    accept: type,
    drop: (item, monitor) => {
      const sourceColumnId = item.columnId;
      if (sourceColumnId !== column.id) {
        moveTask(item.id, sourceColumnId, column.id, 0); 
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <StyledPaper ref={drop} style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {column.name}
      </Typography>
      <div>
        {column.tasks && column.tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} columnId={column.id} />
        ))}
      </div>
    </StyledPaper>
  );
}

export default Column;
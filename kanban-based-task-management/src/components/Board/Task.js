import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDrag } from 'react-dnd';

const StyledCard = styled(Card)`
  margin: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
`;

const type = 'TASK'; 

function Task({ task, index, columnId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id: task.id, columnId: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" component="h3">
            {task.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {task.orders}
          </Typography>
        </CardContent>
      </StyledCard>
    </div>
  );
}

export default Task;
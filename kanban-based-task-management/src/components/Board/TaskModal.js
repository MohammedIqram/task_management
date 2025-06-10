import React from 'react';

function TaskModal({ task, onClose }) {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', border: '1px solid black' }}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default TaskModal;
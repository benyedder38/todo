import './App.css';
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  /**
   * Add task to-do list
   */
  const addTask = () => {
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTask })
    })
    .then(response => response.json())
    .then(task => setTasks([...tasks, task]))
    .catch(err => console.error('Error:', err));
  };
  
  /**
   * Delete task from to-do list
   * @param {*} id 
   */
  const deleteTask = (id) => {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error('Error:', err));
  };

  /**
   * Update task from to-do list
   * @param {*} id 
   * @param {*} content 
   */
  const updateTask = (id, content) => {
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
      })
      .catch(err => console.error('Error:', err));
  };

  return (
    <>
      <Box className="main">
        <Box className="main-header">
          <h1>TO-DO</h1>
        </Box>
        <Box 
          component="form"
          className="main-input"
          noValidate
          
        >
          <TextField 
            id="outlined-basic" 
            label="Add new task" 
            variant='outlined' 
            size="small"
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={addTask}>ADD</Button>
        </Box>
        <Box className="main-list">
          <h2>TASKS:</h2>

          
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <input
                  type="text"
                  value={task.content}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  className="task-content"
                  />
                <button onClick={() => deleteTask(task.id)} className="task-delete-button">DEL</button>
              </li>
            ))}
          </ul>
        </Box>

      </Box>
    </>
  );
}

export default App;

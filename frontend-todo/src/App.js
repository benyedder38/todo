import './App.css';
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  ListItem, 
  ListItemButton, 
  List, 
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue } from '@mui/material/colors';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [secondary, setSecondary] = React.useState(false);

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
    .then(task => {
      setTasks([...tasks, task])
      setNewTask('');
    })
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
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#20C20E', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#20C20E', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#20C20E', // Border color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: '#20C20E', // Default label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#20C20Es', // Label color when focused
              },
              input: { color: '#20C20E' }
            }}
          />
          <Button onClick={addTask} sx={{ color: "#20C20E" }}>ADD</Button>
        </Box>
        <Box className="main-list">
          <h2>TASKS</h2>
          <List>
            {tasks.map((task) => (
              <ListItem 
                disablePadding
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => deleteTask(task.id)}  
                  >
                    <DeleteIcon sx={{ color: "#20C20E"}}/>
                  </IconButton>
                  // <IconButton>
                  // move the update to its own seperate page
                  // <Button onClick={() => updateTask(task.id, task.content)} id="task-update-button">UPDATE</Button>
                  // </IconButton>
                }
              >
                {/* <ListItemText
                  primary="Single-line item"
                  // secondary={secondary ? 'Secondary text' : null}
                /> */}
                <ListItemButton>
                  <ListItemText primary={task.content} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
}

export default App;

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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

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
  
  const deleteTask = (id) => {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error('Error:', err));
  };

  const startEditingTask = (id, content) => {
    setEditTaskId(id);
    setEditTaskContent(content);
  };

  const saveTask = (id) => {
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editTaskContent })
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
        setEditTaskId(null);
        setEditTaskContent('');
      })
      .catch(err => console.error('Error:', err));
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTaskContent('');
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
                color: '#20C20E', // Label color when focused
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
                key={task.id}
                secondaryAction={
                  <>
                    {editTaskId === task.id ? (
                      <>
                        <IconButton 
                          edge="end" 
                          aria-label="save"
                          onClick={() => saveTask(task.id)}
                        >
                          <SaveIcon sx={{ color: "#20C20E"}}/>
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="cancel"
                          onClick={cancelEditing}
                        >
                          <CancelIcon sx={{ color: "#20C20E"}}/>
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => startEditingTask(task.id, task.content)}
                        >
                          <EditIcon sx={{ color: "#20C20E"}}/>
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => deleteTask(task.id)}  
                        >
                          <DeleteIcon sx={{ color: "#20C20E"}}/>
                        </IconButton>
                      </>
                    )}
                  </>
                }
              >
                {editTaskId === task.id ? (
                  <TextField
                    value={editTaskContent}
                    onChange={(e) => setEditTaskContent(e.target.value)}
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
                        color: '#20C20E', // Label color when focused
                      },
                      input: { color: '#20C20E' }
                    }}
                  />
                ) : (
                  <ListItemButton>
                    <ListItemText primary={task.content} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

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
      .then(task => setTasks([...tasks, task]))
      .catch(err => console.error('Error:', err));
  };

  const deleteTask = (id) => {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error('Error:', err));
  };

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
    <div className="App">
      <header className="App-header">
        <h1>Task Master</h1>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="text"
                value={task.content}
                onChange={(e) => updateTask(task.id, e.target.value)}
              />
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;

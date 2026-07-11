import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Statistics from './components/Statistics';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    // Fetch tasks
    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, [filter]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/tasks`;
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            const response = await axios.get(url);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/statistics`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            await axios.post(`${API_URL}/tasks`, taskData);
            fetchTasks();
            fetchStats();
        } catch (error) {
            alert('Error adding task: ' + error.message);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            await axios.put(`${API_URL}/tasks/${id}`, updates);
            fetchTasks();
            fetchStats();
        } catch (error) {
            alert('Error updating task: ' + error.message);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`${API_URL}/tasks/${id}`);
                fetchTasks();
                fetchStats();
            } catch (error) {
                alert('Error deleting task: ' + error.message);
            }
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Task Management System</h1>
                <p>Organize and track your tasks efficiently</p>
            </header>

            <main className="app-main">
                <div className="container">
                    <div className="sidebar">
                        <TaskForm onAddTask={handleAddTask} />
                        <Statistics stats={stats} />
                    </div>

                    <div className="main-content">
                        <div className="filter-section">
                            <h2>Tasks</h2>
                            <div className="filter-buttons">
                                <button
                                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                                    onClick={() => setFilter('pending')}
                                >
                                    Pending
                                </button>
                                <button
                                    className={filter === 'in-progress' ? 'filter-btn active' : 'filter-btn'}
                                    onClick={() => setFilter('in-progress')}
                                >
                                    In Progress
                                </button>
                                <button
                                    className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
                                    onClick={() => setFilter('completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading">Loading tasks...</div>
                        ) : (
                            <TaskList
                                tasks={tasks}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;

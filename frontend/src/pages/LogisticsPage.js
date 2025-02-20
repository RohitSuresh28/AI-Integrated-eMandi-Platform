import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import './farmerstyles.css'
import { useNavigate } from 'react-router-dom';
const LogisticsPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [produceId, setProduceId] = useState('');
    const [highestBid, setHighestBid] = useState(null);
    const [error, setError] = useState(null);  // Error state for user feedback
    const [successMessage, setSuccessMessage] = useState(null);  // Success state for user feedback

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    const validateForm = () => {
        if (typeof taskTitle !== 'string' || taskTitle.trim() === '' || !alphanumericRegex.test(taskTitle)) {
            return 'Task title must be alphanumeric (letters and numbers) and cannot be empty.';
        }
        if (typeof produceId !== 'string' || produceId.trim() === '' || !alphanumericRegex.test(produceId)) {
            return 'Produce ID must be alphanumeric (letters and numbers) and cannot be empty.';
        }
        if (highestBid === null || highestBid <= 0) {
            return 'Please ensure the highest bid is a positive number.';
        }
        return null;
    };

    // Fetch tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('http://127.0.0.1:5000/logistics/tasks')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setTasks(response.data);  // Set tasks if the response has data
                } else {
                    setTasks([]);  // If no tasks, set an empty array
                    setError("No tasks found.");
                }
            })
            .catch(err => {
                console.error("Error fetching tasks:", err);
                setError("Error fetching tasks!");  // Show error message
            });
    };


    // Fetch the highest bid for a specific produce ID
    const fetchHighestBid = (produce_id) => {
        axios.get(`http://127.0.0.1:5000/logistics/tasks/highest-bid/${produce_id}`)
            .then(response => {
                if (response.data && response.data.highest_bid) {
                    setHighestBid(response.data.highest_bid);  // Set highest bid
                    setError(null);  // Clear any previous errors
                } else {
                    setHighestBid(null);  // No bid found
                    setError("No bid found for the selected produce.");
                }
            })
            .catch(err => {
                console.error("Error fetching highest bid:", err);
                setError("Error fetching highest bid!");  // Set error message
            });
    };
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user session
        navigate('/'); // Navigate back to the landing page
    };
    // Add a task
    const handleAddTask = () => {
        if (!highestBid) {
            setError("No bid found for the selected produce.");
            return;
        }
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const newTask = {
            task_id: Date.now().toString(),  // Auto-generated ID
            title: taskTitle,
            produce_id: produceId,
            highest_bid: highestBid,
        };

        axios.post('http://127.0.0.1:5000/logistics/tasks', newTask)
            .then(() => {
                setTaskTitle('');  // Clear input field
                setProduceId('');
                setHighestBid(null);  // Clear highest bid
                setSuccessMessage("Task added successfully!");
                fetchTasks();  // Refresh the task list
            })
            .catch(err => {
                console.error("Error adding task:", err);
                setError("Error adding task!");
            });
    };

    // Mark task as completed
    const completeTask = (task_id) => {
        axios.put(`http://127.0.0.1:5000/logistics/tasks/${task_id}`, { status: 'completed' })
            .then(() => {
                fetchTasks(); // Refresh the task list
            })
            .catch(err => {
                console.error("Error completing task:", err);
            });
    };

    return (
        <div className="logistics-page">
            {/* Success or Error Messages */}
            {successMessage && <div className="message success">{successMessage}</div>}
            {error && <div className="message error">{error}</div>}
            <h2>Logistics Dashboard</h2>
            {/* Add Task Form */}
            <div className="logout-button-container">
                <button onClick={handleLogout} className="btn secondary">Logout</button>
            </div>
            <div className="form-section">
                <h3>Create Task</h3>
                <div className="form-input">
                    <input
                        type="text"
                        placeholder="Enter Task Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="text"
                        placeholder="Enter Produce ID"
                        value={produceId}
                        onChange={(e) => {
                            setProduceId(e.target.value);
                            fetchHighestBid(e.target.value);  // Fetch the highest bid when produce_id changes
                        }}
                    />
                </div>

                {/* Display Highest Bid */}
                {highestBid !== null && (
                    <div className="highest-bid">
                        <p>Highest Bid for this Produce: ${highestBid}</p>
                    </div>
                )}

                <button className="btn primary" onClick={handleAddTask}>Add Task</button>
            </div>

            {/* View Tasks Section */}
            <div className="tasks-section">
                <h3>Task List</h3>
                <ul className="tasks-list">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <li key={task.task_id} className="task-item">
                                {task.title} - {task.status} - Highest Bid: ${task.highest_bid}
                                <button className="btn secondary" onClick={() => completeTask(task.task_id)}>Complete</button>
                            </li>
                        ))
                    ) : (
                        <li>No tasks available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default LogisticsPage;

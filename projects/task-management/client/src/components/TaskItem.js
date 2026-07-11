import React, { useState } from 'react';
import '../styles/TaskItem.css';

function TaskItem({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedPriority, setEditedPriority] = useState(task.priority);

    const handleSaveEdit = () => {
        onUpdate(task.id, {
            title: editedTitle,
            status: editedStatus,
            priority: editedPriority
        });
        setIsEditing(false);
    };

    const handleStatusChange = (newStatus) => {
        setEditedStatus(newStatus);
        onUpdate(task.id, { status: newStatus });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#ff6b6b';
            case 'medium':
                return '#ffa94d';
            case 'low':
                return '#51cf66';
            default:
                return '#868e96';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#51cf66';
            case 'in-progress':
                return '#4dabf7';
            case 'pending':
                return '#868e96';
            default:
                return '#868e96';
        }
    };

    return (
        <div className={`task-item ${task.status}`}>
            <div className="task-header">
                <div className="task-title-section">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="edit-input"
                        />
                    ) : (
                        <h4 className="task-title">{task.title}</h4>
                    )}
                </div>

                <div className="task-badges">
                    <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                        {task.priority}
                    </span>
                    <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                        {task.status}
                    </span>
                </div>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                {task.category && (
                    <span className="category">{task.category}</span>
                )}
                {task.dueDate && (
                    <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
                <span className="created-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="task-actions">
                {isEditing ? (
                    <>
                        <button className="btn-save" onClick={handleSaveEdit}>
                            Save
                        </button>
                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <select
                            className="status-select"
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className="btn-delete" onClick={() => onDelete(task.id)}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default TaskItem;

import React from 'react';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks found. Create a new task to get started!</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                />
            ))}
        </div>
    );
}

export default TaskList;

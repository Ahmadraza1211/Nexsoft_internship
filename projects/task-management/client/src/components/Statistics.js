import React from 'react';
import '../styles/Statistics.css';

function Statistics({ stats }) {
    return (
        <div className="statistics">
            <h3>Statistics</h3>
            <div className="stat-items">
                <div className="stat-item total">
                    <span className="stat-value">{stats.total || 0}</span>
                    <span className="stat-label">Total Tasks</span>
                </div>
                <div className="stat-item pending">
                    <span className="stat-value">{stats.pending || 0}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item progress">
                    <span className="stat-value">{stats.inProgress || 0}</span>
                    <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-item completed">
                    <span className="stat-value">{stats.completed || 0}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            {stats.total > 0 && (
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${((stats.completed || 0) / stats.total) * 100}%`
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export default Statistics;

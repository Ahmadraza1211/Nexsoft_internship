import React from 'react';
import '../styles/Statistics.css';

function Statistics({ stats }) {
    return (
        <div className="statistics">
            <h3>Your Notes</h3>
            <div className="stat-items">
                <div className="stat-item">
                    <span className="stat-value">{stats.total || 0}</span>
                    <span className="stat-label">Total Notes</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.favorites || 0}</span>
                    <span className="stat-label">Favorites</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.pinned || 0}</span>
                    <span className="stat-label">Pinned</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.categories || 0}</span>
                    <span className="stat-label">Categories</span>
                </div>
            </div>
        </div>
    );
}

export default Statistics;

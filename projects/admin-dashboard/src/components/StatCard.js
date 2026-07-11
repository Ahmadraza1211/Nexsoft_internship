import React from 'react';
import '../styles/StatCard.css';

function StatCard({ title, value, change, icon, color }) {
    const isPositive = !change.startsWith('-');

    return (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-header">
                <span className="stat-icon" style={{ backgroundColor: `${color}20` }}>
                    {icon}
                </span>
                <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                    {change}
                </span>
            </div>
            <div className="stat-body">
                <p className="stat-title">{title}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
        </div>
    );
}

export default StatCard;

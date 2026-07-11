import React from 'react';
import '../styles/ChartCard.css';

function ChartCard({ title, data, labels, color = '#667eea' }) {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    // Normalize data for visualization
    const normalizedData = data.map(val =>
        range === 0 ? 50 : ((val - minValue) / range) * 100
    );

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3>{title}</h3>
                <span className="chart-menu">⋯</span>
            </div>
            <div className="chart-container">
                <div className="bars-container">
                    {normalizedData.map((height, index) => (
                        <div key={index} className="bar-wrapper">
                            <div
                                className="bar"
                                style={{
                                    height: `${height}%`,
                                    backgroundColor: color,
                                }}
                                title={`${labels[index]}: ${data[index]}`}
                            />
                            <span className="bar-label">{labels[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chart-footer">
                <span>Last 7 days</span>
                <span className="chart-value">{Math.max(...data)} Peak</span>
            </div>
        </div>
    );
}

export default ChartCard;

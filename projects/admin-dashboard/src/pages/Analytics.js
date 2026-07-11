import React from 'react';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import '../styles/Pages.css';

function Analytics() {
    const analyticsStats = [
        { title: 'Page Views', value: '45,231', change: '+15%', icon: '👁️', color: '#667eea' },
        { title: 'Unique Visitors', value: '12,543', change: '+23%', icon: '🌍', color: '#4dabf7' },
        { title: 'Bounce Rate', value: '42.3%', change: '-5%', icon: '📉', color: '#ff6b6b' },
        { title: 'Avg. Session', value: '4m 23s', change: '+8%', icon: '⏱️', color: '#51cf66' },
    ];

    return (
        <div className="page analytics-page">
            <div className="page-header">
                <h1>Analytics</h1>
                <p>Track your system performance and user behavior</p>
            </div>

            <div className="stats-grid">
                {analyticsStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="analytics-grid">
                <ChartCard
                    title="Daily Page Views"
                    data={[450, 520, 480, 610, 570, 640, 720]}
                    labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                />
                <ChartCard
                    title="User Retention"
                    data={[85, 87, 84, 89, 88, 91, 92]}
                    labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']}
                    color="#51cf66"
                />
            </div>

            <div className="analytics-grid">
                <div className="card">
                    <h3>Traffic Sources</h3>
                    <div className="traffic-sources">
                        <div className="source-item">
                            <div className="source-name">Direct</div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{ width: '60%', backgroundColor: '#667eea' }}></div>
                            </div>
                            <div className="source-value">45%</div>
                        </div>
                        <div className="source-item">
                            <div className="source-name">Search</div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{ width: '25%', backgroundColor: '#4dabf7' }}></div>
                            </div>
                            <div className="source-value">25%</div>
                        </div>
                        <div className="source-item">
                            <div className="source-name">Referral</div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{ width: '10%', backgroundColor: '#51cf66' }}></div>
                            </div>
                            <div className="source-value">10%</div>
                        </div>
                        <div className="source-item">
                            <div className="source-name">Social</div>
                            <div className="source-bar">
                                <div className="bar-fill" style={{ width: '5%', backgroundColor: '#ffa94d' }}></div>
                            </div>
                            <div className="source-value">5%</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>Device Distribution</h3>
                    <div className="device-distribution">
                        <div className="device-item">
                            <span>Desktop</span>
                            <strong>65%</strong>
                        </div>
                        <div className="device-item">
                            <span>Mobile</span>
                            <strong>28%</strong>
                        </div>
                        <div className="device-item">
                            <span>Tablet</span>
                            <strong>7%</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;

import React from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import '../styles/Pages.css';

function Dashboard() {
    const stats = [
        { title: 'Total Users', value: '2,543', change: '+12%', icon: '👥', color: '#667eea' },
        { title: 'Revenue', value: '$45,230', change: '+8%', icon: '💰', color: '#51cf66' },
        { title: 'Orders', value: '1,234', change: '+5%', icon: '📦', color: '#4dabf7' },
        { title: 'Conversion', value: '3.2%', change: '-2%', icon: '📊', color: '#ff6b6b' },
    ];

    const recentActivity = [
        { id: 1, user: 'John Doe', action: 'Created new account', time: '2 hours ago' },
        { id: 2, user: 'Jane Smith', action: 'Completed purchase', time: '3 hours ago' },
        { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '5 hours ago' },
        { id: 4, user: 'Sarah Williams', action: 'Posted comment', time: '1 day ago' },
        { id: 5, user: 'Tom Brown', action: 'Changed settings', time: '2 days ago' },
    ];

    return (
        <div className="page dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here&apos;s what&apos;s happening in your system today.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-grid">
                <ChartCard
                    title="Users Trend"
                    data={[120, 150, 130, 200, 180, 210, 240]}
                    labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                />
                <ChartCard
                    title="Revenue Trend"
                    data={[3000, 3500, 3200, 4100, 3800, 4200, 4600]}
                    labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                    color="#51cf66"
                />
            </div>

            <div className="recent-activity">
                <div className="activity-header">
                    <h2>Recent Activity</h2>
                    <a href="#" className="view-all">View All →</a>
                </div>
                <div className="activity-list">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-icon">
                                {activity.user.charAt(0)}
                            </div>
                            <div className="activity-content">
                                <p className="activity-user">{activity.user}</p>
                                <p className="activity-action">{activity.action}</p>
                            </div>
                            <span className="activity-time">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

import React, { useState } from 'react';
import '../styles/Navbar.css';

function Navbar({ onMenuClick }) {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const notifications = [
        { id: 1, message: 'New user registered', time: '5 minutes ago' },
        { id: 2, message: 'System backup completed', time: '1 hour ago' },
        { id: 3, message: 'New support ticket', time: '2 hours ago' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="menu-toggle" onClick={onMenuClick} title="Toggle sidebar">
                    ☰
                </button>
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="navbar-right">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="navbar-actions">
                    <div className="notification-bell">
                        <button
                            className="icon-btn"
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            title="Notifications"
                        >
                            🔔
                            <span className="badge">3</span>
                        </button>
                        {notificationOpen && (
                            <div className="notification-dropdown">
                                <div className="dropdown-header">Notifications</div>
                                {notifications.map(notif => (
                                    <div key={notif.id} className="notification-item">
                                        <p>{notif.message}</p>
                                        <small>{notif.time}</small>
                                    </div>
                                ))}
                                <div className="dropdown-footer">View All</div>
                            </div>
                        )}
                    </div>

                    <div className="profile-menu">
                        <button
                            className="icon-btn profile-btn"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            title="Profile"
                        >
                            👤
                        </button>
                        {profileMenuOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item">Profile</div>
                                <div className="dropdown-item">Settings</div>
                                <div className="dropdown-item">Help</div>
                                <hr />
                                <div className="dropdown-item logout">Logout</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

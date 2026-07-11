import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, setCurrentPage, currentPage }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🎯</span>
                    {isOpen && <span className="logo-text">AdminHub</span>}
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                        title={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {isOpen && <span className="nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">👤</div>
                    {isOpen && (
                        <div className="profile-info">
                            <p className="username">Admin User</p>
                            <p className="role">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

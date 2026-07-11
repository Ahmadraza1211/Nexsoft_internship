import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './App.css';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <Users />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app">
            <Sidebar isOpen={sidebarOpen} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <div className="main-content">
                <Navbar onMenuClick={toggleSidebar} />
                <div className="page-content">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

export default App;

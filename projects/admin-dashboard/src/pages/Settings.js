import React, { useState } from 'react';
import '../styles/Pages.css';

function Settings() {
    const [settings, setSettings] = useState({
        siteName: 'AdminHub',
        email: 'admin@adminhub.com',
        timezone: 'UTC',
        language: 'English',
        emailNotifications: true,
        maintenanceMode: false,
        backupEnabled: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="page settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Configure your admin dashboard and system preferences</p>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>General Settings</h2>
                    <div className="setting-group">
                        <label htmlFor="siteName">Site Name</label>
                        <input
                            type="text"
                            id="siteName"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="setting-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="setting-group">
                        <label htmlFor="timezone">Timezone</label>
                        <select
                            id="timezone"
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                        >
                            <option>UTC</option>
                            <option>EST</option>
                            <option>CST</option>
                            <option>MST</option>
                            <option>PST</option>
                        </select>
                    </div>

                    <div className="setting-group">
                        <label htmlFor="language">Language</label>
                        <select
                            id="language"
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Chinese</option>
                        </select>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Notifications</h2>
                    <div className="setting-group checkbox">
                        <input
                            type="checkbox"
                            id="emailNotifications"
                            name="emailNotifications"
                            checked={settings.emailNotifications}
                            onChange={handleChange}
                        />
                        <label htmlFor="emailNotifications">Enable Email Notifications</label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>System Settings</h2>
                    <div className="setting-group checkbox">
                        <input
                            type="checkbox"
                            id="maintenanceMode"
                            name="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={handleChange}
                        />
                        <label htmlFor="maintenanceMode">Maintenance Mode</label>
                    </div>

                    <div className="setting-group checkbox">
                        <input
                            type="checkbox"
                            id="backupEnabled"
                            name="backupEnabled"
                            checked={settings.backupEnabled}
                            onChange={handleChange}
                        />
                        <label htmlFor="backupEnabled">Enable Automatic Backup</label>
                    </div>
                </div>

                <div className="settings-actions">
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Settings
                    </button>
                    <button className="btn btn-secondary">
                        Reset to Default
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;

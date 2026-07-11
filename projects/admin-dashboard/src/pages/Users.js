import React, { useState } from 'react';
import '../styles/Pages.css';

function Users() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2023-02-20' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', joinDate: '2023-03-10' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Moderator', status: 'Active', joinDate: '2023-04-05' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'User', status: 'Active', joinDate: '2023-05-12' },
        { id: 6, name: 'Emma Davis', email: 'emma@example.com', role: 'User', status: 'Active', joinDate: '2023-06-18' },
    ]);

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return '#667eea';
            case 'Moderator': return '#ffa94d';
            case 'User': return '#868e96';
            default: return '#868e96';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active' ? '#51cf66' : '#ff6b6b';
    };

    return (
        <div className="page users-page">
            <div className="page-header">
                <h1>Users Management</h1>
                <button className="btn btn-primary">+ Add User</button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="user-name">
                                    <div className="avatar-small">{user.name.charAt(0)}</div>
                                    {user.name}
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: `${getRoleColor(user.role)}20`, color: getRoleColor(user.role) }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: `${getStatusColor(user.status)}20`, color: getStatusColor(user.status) }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.joinDate}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-small">Edit</button>
                                        <button className="btn-small btn-danger">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at', dbPath);
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            dueDate TEXT,
            category TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err);
        } else {
            console.log('Tasks table ready');
        }
    });
}

// Routes

// GET all tasks with optional filter
app.get('/api/tasks', (req, res) => {
    const { status, priority, category } = req.query;
    let query = 'SELECT * FROM tasks';
    const params = [];

    const conditions = [];
    if (status) {
        conditions.push('status = ?');
        params.push(status);
    }
    if (priority) {
        conditions.push('priority = ?');
        params.push(priority);
    }
    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json(row);
        }
    });
});

// CREATE new task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority, dueDate, category } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.run(
        'INSERT INTO tasks (title, description, priority, dueDate, category) VALUES (?, ?, ?, ?, ?)',
        [title, description || '', priority || 'medium', dueDate || null, category || 'General'],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({
                    id: this.lastID,
                    title,
                    description: description || '',
                    status: 'pending',
                    priority: priority || 'medium',
                    dueDate: dueDate || null,
                    category: category || 'General',
                    createdAt: new Date().toISOString()
                });
            }
        }
    );
});

// UPDATE task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, category } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (priority !== undefined) {
        updates.push('priority = ?');
        values.push(priority);
    }
    if (dueDate !== undefined) {
        updates.push('dueDate = ?');
        values.push(dueDate);
    }
    if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, values, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

// GET statistics
app.get('/api/statistics', (req, res) => {
    db.all(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress
        FROM tasks
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows[0]);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Task Management API running on http://localhost:${PORT}`);
    console.log(`Database: ${dbPath}`);
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

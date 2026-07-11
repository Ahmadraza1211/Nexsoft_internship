const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'notes.db');
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
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            color TEXT DEFAULT 'yellow',
            category TEXT DEFAULT 'General',
            tags TEXT,
            isPinned INTEGER DEFAULT 0,
            isFavorite INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating notes table:', err);
        } else {
            console.log('Notes table ready');
        }
    });
}

// Routes

// GET all notes
app.get('/api/notes', (req, res) => {
    const { category, tag, isPinned, isFavorite } = req.query;
    let query = 'SELECT * FROM notes';
    const params = [];
    const conditions = [];

    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (isPinned !== undefined) {
        conditions.push('isPinned = ?');
        params.push(isPinned === 'true' ? 1 : 0);
    }
    if (isFavorite !== undefined) {
        conditions.push('isFavorite = ?');
        params.push(isFavorite === 'true' ? 1 : 0);
    }
    if (tag) {
        conditions.push("tags LIKE ?");
        params.push(`%${tag}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY isPinned DESC, updatedAt DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// GET single note
app.get('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Note not found' });
        } else {
            res.json(row);
        }
    });
});

// CREATE new note
app.post('/api/notes', (req, res) => {
    const { title, content, color, category, tags } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.run(
        'INSERT INTO notes (title, content, color, category, tags) VALUES (?, ?, ?, ?, ?)',
        [title, content || '', color || 'yellow', category || 'General', tags || ''],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({
                    id: this.lastID,
                    title,
                    content: content || '',
                    color: color || 'yellow',
                    category: category || 'General',
                    tags: tags || '',
                    isPinned: 0,
                    isFavorite: 0,
                    createdAt: new Date().toISOString()
                });
            }
        }
    );
});

// UPDATE note
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, color, category, tags, isPinned, isFavorite } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (content !== undefined) {
        updates.push('content = ?');
        values.push(content);
    }
    if (color !== undefined) {
        updates.push('color = ?');
        values.push(color);
    }
    if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
    }
    if (tags !== undefined) {
        updates.push('tags = ?');
        values.push(tags);
    }
    if (isPinned !== undefined) {
        updates.push('isPinned = ?');
        values.push(isPinned ? 1 : 0);
    }
    if (isFavorite !== undefined) {
        updates.push('isFavorite = ?');
        values.push(isFavorite ? 1 : 0);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, values, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Note not found' });
        } else {
            res.json({ message: 'Note updated successfully' });
        }
    });
});

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Note not found' });
        } else {
            res.json({ message: 'Note deleted successfully' });
        }
    });
});

// GET statistics
app.get('/api/statistics', (req, res) => {
    db.all(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN isFavorite = 1 THEN 1 ELSE 0 END) as favorites,
            SUM(CASE WHEN isPinned = 1 THEN 1 ELSE 0 END) as pinned,
            COUNT(DISTINCT category) as categories
        FROM notes
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows[0]);
        }
    });
});

// GET all categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT DISTINCT category FROM notes ORDER BY category', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(r => r.category));
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Notes Management API running on http://localhost:${PORT}`);
    console.log(`Database: ${dbPath}`);
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

# Notes Management System

A full-stack notes management application built with React frontend, Node.js/Express backend, and SQLite database.

## Features

- ✏️ **Create, Edit, Delete Notes** - Full note management functionality
- 🏷️ **Categories & Tags** - Organize notes by category and tags
- 🎨 **Color Coding** - 6 different colors to visually organize notes
- ⭐ **Favorites** - Mark important notes as favorites
- 📌 **Pin Notes** - Pin important notes to the top
- 🔍 **Search** - Search across all notes and content
- 📊 **Statistics** - View your notes statistics (total, favorites, pinned, categories)
- 💾 **Persistent Database** - SQLite for data persistence
- 📱 **Responsive Design** - Beautiful grid layout that adapts to screen size
- 🎯 **Category Management** - Automatic category detection and filtering

## Technology Stack

### Frontend
- React 18
- Axios (HTTP client)
- CSS3 Grid & Flexbox

### Backend
- Node.js
- Express.js (REST API)
- SQLite3 (Database)
- CORS middleware

### Development Tools
- Nodemon (Auto-restart server)
- Concurrently (Run multiple processes)

## Project Structure

```
notes-management/
├── server.js                 # Express server and API routes
├── package.json              # Server dependencies
├── notes.db                  # SQLite database (auto-created)
├── client/
│   ├── public/
│   │   └── index.html        # React entry point
│   ├── src/
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # App styles
│   │   ├── index.js          # React DOM render
│   │   ├── index.css         # Global styles
│   │   ├── components/
│   │   │   ├── NoteForm.js   # Note creation/edit form
│   │   │   ├── NoteGrid.js   # Notes grid display
│   │   │   ├── NoteCard.js   # Individual note card
│   │   │   └── Statistics.js # Statistics component
│   │   └── styles/
│   │       ├── NoteForm.css
│   │       ├── NoteCard.css
│   │       ├── NoteGrid.css
│   │       └── Statistics.css
│   └── package.json          # React dependencies
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Backend Dependencies
```bash
cd notes-management
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Run the Application

#### Option A: Run Backend and Frontend Separately
**Terminal 1 - Start Backend:**
```bash
npm run server
```
The API will be available at: http://localhost:5001

**Terminal 2 - Start Frontend:**
```bash
npm run client
```
The app will open at: http://localhost:3000

#### Option B: Run Both Together
```bash
npm run dev
```

## API Endpoints

### Notes

**GET /api/notes** - Get all notes (with optional filters)
```bash
curl http://localhost:5001/api/notes
curl "http://localhost:5001/api/notes?category=Work"
curl "http://localhost:5001/api/notes?isPinned=true"
curl "http://localhost:5001/api/notes?isFavorite=true"
```

**GET /api/notes/:id** - Get a specific note
```bash
curl http://localhost:5001/api/notes/1
```

**POST /api/notes** - Create a new note
```bash
curl -X POST http://localhost:5001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first note",
    "content": "This is my note content",
    "color": "yellow",
    "category": "Work",
    "tags": "important, urgent"
  }'
```

**PUT /api/notes/:id** - Update a note
```bash
curl -X PUT http://localhost:5001/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "isPinned": true,
    "isFavorite": true
  }'
```

**DELETE /api/notes/:id** - Delete a note
```bash
curl -X DELETE http://localhost:5001/api/notes/1
```

**GET /api/statistics** - Get notes statistics
```bash
curl http://localhost:5001/api/statistics
```

**GET /api/categories** - Get all categories
```bash
curl http://localhost:5001/api/categories
```

## Usage

1. **Create a Note**: Fill in the form on the left sidebar and click "Add Note"
2. **Edit a Note**: Click "Edit" on any note card to modify it
3. **Color Code**: Select a color to visually organize your notes (6 colors available)
4. **Add Tags**: Add comma-separated tags to organize notes by topic
5. **Favorite Notes**: Click the star icon to mark important notes
6. **Pin Notes**: Click the pin icon to keep notes at the top
7. **Search**: Use the search bar to find notes by title or content
8. **Filter by Category**: Use category buttons to view notes by category
9. **View Statistics**: Check the sidebar to see your notes statistics

## Available Colors

- Yellow (#FFE066)
- Blue (#74C0FC)
- Green (#69DB7C)
- Pink (#FFB3BA)
- Purple (#B197FC)
- Orange (#FFA94D)

## Database Schema

### notes table
```sql
CREATE TABLE notes (
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
```

## Troubleshooting

### Port Already in Use
If port 5001 or 3000 is already in use, you can change them:
- Backend: Modify `PORT` in `server.js`
- Frontend: Use `PORT=3001 npm start` in the client folder

### Database Issues
If you encounter database errors:
1. Delete the `notes.db` file
2. Restart the server - it will recreate the database

### CORS Errors
Make sure the backend is running on http://localhost:5001 before starting the frontend.

## Future Enhancements

- Rich text editor for notes
- Note sharing functionality
- Collaborative editing
- Cloud sync
- Mobile app
- Dark mode
- Note export (PDF, Word, etc.)
- Voice notes
- Image attachments

## License

MIT License - Feel free to use this project for learning and development.

Happy note-taking! 📝

# Task Management System

A full-stack task management application built with React frontend, Node.js/Express backend, and SQLite database.

## Features

- ✅ **Create, Read, Update, Delete Tasks** - Full CRUD operations
- 🏷️ **Task Categories** - Organize tasks by category
- 📊 **Priority Levels** - Set task priority (Low, Medium, High)
- 📅 **Due Dates** - Assign due dates to tasks
- 🔄 **Task Status** - Track task status (Pending, In Progress, Completed)
- 📈 **Statistics Dashboard** - View task completion statistics
- 🔍 **Filter Tasks** - Filter by status, priority, or category
- 💾 **Persistent Database** - SQLite for data persistence
- 🎨 **Responsive UI** - Beautiful, mobile-friendly interface
- ⚡ **Real-time Updates** - Instant UI updates after changes

## Technology Stack

### Frontend
- React 18
- Axios (HTTP client)
- CSS3 (Responsive design)

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
task-management/
├── server.js                 # Express server and API routes
├── package.json              # Server dependencies
├── tasks.db                  # SQLite database (auto-created)
├── client/
│   ├── public/
│   │   └── index.html        # React entry point
│   ├── src/
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # App styles
│   │   ├── index.js          # React DOM render
│   │   ├── index.css         # Global styles
│   │   ├── components/
│   │   │   ├── TaskForm.js   # Task creation form
│   │   │   ├── TaskList.js   # Task list display
│   │   │   ├── TaskItem.js   # Individual task component
│   │   │   └── Statistics.js # Stats component
│   │   └── styles/
│   │       ├── TaskForm.css
│   │       ├── TaskList.css
│   │       ├── TaskItem.css
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
cd task-management
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
The API will be available at: http://localhost:5000

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

### Tasks

**GET /api/tasks** - Get all tasks (with optional filters)
```bash
curl http://localhost:5000/api/tasks
curl "http://localhost:5000/api/tasks?status=completed"
curl "http://localhost:5000/api/tasks?priority=high&category=Work"
```

**GET /api/tasks/:id** - Get a specific task
```bash
curl http://localhost:5000/api/tasks/1
```

**POST /api/tasks** - Create a new task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the React project",
    "priority": "high",
    "category": "Work",
    "dueDate": "2024-12-31"
  }'
```

**PUT /api/tasks/:id** - Update a task
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "medium"
  }'
```

**DELETE /api/tasks/:id** - Delete a task
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

**GET /api/statistics** - Get task statistics
```bash
curl http://localhost:5000/api/statistics
```

## Usage

1. **Add a Task**: Fill in the form on the left sidebar and click "Add Task"
2. **View Tasks**: See all tasks in the main content area
3. **Filter Tasks**: Use filter buttons to view specific task statuses
4. **Update Status**: Use the dropdown to change task status
5. **Edit Task**: Click "Edit" to modify the task title or other details
6. **Delete Task**: Click "Delete" to remove a task
7. **View Statistics**: Check the statistics panel to see task completion progress

## Database Schema

### tasks table
```sql
CREATE TABLE tasks (
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
```

## Status Values
- `pending` - Task not yet started
- `in-progress` - Task is being worked on
- `completed` - Task is finished

## Priority Levels
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, you can change them:
- Backend: Modify `PORT` in `server.js`
- Frontend: Use `PORT=3001 npm start` in the client folder

### Database Issues
If you encounter database errors:
1. Delete the `tasks.db` file
2. Restart the server - it will recreate the database

### CORS Errors
Make sure the backend is running on http://localhost:5000 before starting the frontend.

## Features to Implement (Future)
- User authentication
- Task tags/labels
- Task search functionality
- Recurring tasks
- Task attachments
- Email notifications
- Task templates
- Collaboration features

## License

MIT License - Feel free to use this project for learning and development.

## Support

For issues or questions, refer to the project structure and API documentation above.

Happy task managing! 🚀

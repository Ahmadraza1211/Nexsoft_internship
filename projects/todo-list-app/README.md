# To-Do List Application

A feature-rich to-do list application built with vanilla HTML, CSS, and JavaScript with local storage persistence.

## Features

- ✅ **Add, Complete, and Delete Tasks** - Full task management functionality
- 🔄 **Filter Tasks** - View All, Active, or Completed tasks
- 📊 **Statistics** - Track total, completed, and remaining tasks
- 💾 **Local Storage** - Tasks persist between browser sessions
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🗑️ **Bulk Actions** - Clear completed tasks or delete all tasks
- ⌨️ **Keyboard Support** - Press Enter to add tasks quickly
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

## How to Run

### Option 1: Direct Browser
1. Navigate to the `todo-list-app` folder
2. Open `index.html` directly in your web browser
3. Start adding tasks!

### Option 2: Using a Local Server
```bash
# Using Python (Python 3)
python -m http.server 8000

# Or using Node.js (if you have http-server installed)
npx http-server

# Or using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

1. **Add a Task**: Type in the input field and click "Add Task" or press Enter
2. **Complete a Task**: Check the checkbox next to a task
3. **Delete a Task**: Click the "Delete" button on the task
4. **Filter Tasks**: Click the filter buttons to show All, Active, or Completed tasks
5. **Clear Completed**: Remove all completed tasks at once
6. **Delete All**: Remove all tasks (with confirmation)
7. **View Statistics**: See your task counts at the top

## File Structure

```
todo-list-app/
├── index.html    # Main HTML structure
├── style.css     # Styling and responsive design
├── script.js     # Task management and DOM logic
└── README.md     # This file
```

## Data Storage

Tasks are automatically saved to your browser's local storage. This means:
- Your tasks persist even after closing the browser
- Tasks are stored locally on your device (no cloud sync)
- Clearing browser data will delete your tasks
- Each browser/device has its own separate task list

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Tips

- Use keyboard shortcut: Press **Enter** to quickly add a new task
- Hover over tasks to see the delete button
- Statistics update automatically as you manage tasks
- Your data is never sent to any server - it stays on your device

Get organized and boost your productivity! 🚀

# SimpleChat — Socket.io Chat Application

A simple real-time chat application built with React (Vite), Node.js, Express, and Socket.io.

## Features

- **Multiple chat rooms** — General, Technology, Random, Gaming
- **Real-time messaging** — Instant message delivery via Socket.io
- **Online users** — See who's in each room
- **Message history** — Last 50 messages per room (in-memory)
- **Responsive design** — Works on desktop and mobile
- **No database required** — Pure in-memory, no setup needed

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express + Socket.io
- **Styling**: Plain CSS (WhatsApp-inspired)

## Setup & Run

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm start
```

The server runs on **port 3005**.

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on **port 5173**. Open it in your browser.

## Socket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `join_room` | `{ username, room }` | Join a chat room |
| `send_message` | `{ username, room, text, time }` | Send a message to a room |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `chat_history` | `Message[]` | Last 50 messages in the joined room |
| `receive_message` | `Message` | A new message from any user |
| `room_users` | `string[]` | List of online usernames in the room |
| `user_joined` | `{ username, room }` | A user joined the room |
| `user_left` | `{ username, room }` | A user left the room |

### Message Object

```js
{
  id: string,
  username: string,
  text: string,
  time: string,    // e.g. "2:30:45 PM"
  type?: 'system'  // present for join/leave notifications
}
```

## Project Structure

```
socket-chat-app/
├── backend/
│   ├── package.json
│   └── server.js          # Express + Socket.io server
├── frontend/
│   ├── package.json
│   ├── vite.config.js     # Proxy /socket.io to backend
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # Root component, socket connection
│       ├── App.css
│       └── components/
│           ├── JoinScreen.jsx/css
│           ├── ChatRoom.jsx/css
│           ├── MessageList.jsx/css
│           ├── MessageInput.jsx/css
│           └── Sidebar.jsx/css
├── README.md
└── .gitignore
```

## License

MIT
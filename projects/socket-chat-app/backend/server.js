const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const ROOMS = ['General', 'Technology', 'Random', 'Gaming'];

// In-memory storage
const roomMessages = new Map();   // room -> array of messages (max 50)
const roomUsers = new Map();      // room -> Set of usernames
const socketMap = new Map();      // socketId -> { username, room }

// Initialize room structures
ROOMS.forEach((room) => {
  roomMessages.set(room, []);
  roomUsers.set(room, new Set());
});

function getRoomUsersList(room) {
  const users = roomUsers.get(room);
  return users ? Array.from(users) : [];
}

function addMessage(room, message) {
  const messages = roomMessages.get(room);
  if (messages) {
    messages.push(message);
    if (messages.length > 50) {
      messages.shift();
    }
  }
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', ({ username, room }) => {
    // Leave previous room if any
    const prev = socketMap.get(socket.id);
    if (prev) {
      socket.leave(prev.room);
      const prevUsers = roomUsers.get(prev.room);
      if (prevUsers) {
        prevUsers.delete(prev.username);
        io.to(prev.room).emit('room_users', getRoomUsersList(prev.room));
        io.to(prev.room).emit('user_left', { username: prev.username, room: prev.room });
      }
    }

    // Join new room
    socket.join(room);
    socketMap.set(socket.id, { username, room });

    const users = roomUsers.get(room);
    if (users) {
      users.add(username);
    }

    // Send chat history to the joining user
    const history = roomMessages.get(room) || [];
    socket.emit('chat_history', history);

    // Notify room
    socket.to(room).emit('user_joined', { username, room });
    io.to(room).emit('room_users', getRoomUsersList(room));

    console.log(`${username} joined ${room}`);
  });

  socket.on('send_message', ({ username, room, text, time }) => {
    const message = { username, room, text, time, id: Date.now().toString() };
    addMessage(room, message);
    io.to(room).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    const data = socketMap.get(socket.id);
    if (data) {
      const { username, room } = data;
      const users = roomUsers.get(room);
      if (users) {
        users.delete(username);
        io.to(room).emit('user_left', { username, room });
        io.to(room).emit('room_users', getRoomUsersList(room));
      }
      socketMap.delete(socket.id);
      console.log(`${username} disconnected from ${room}`);
    }
  });
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
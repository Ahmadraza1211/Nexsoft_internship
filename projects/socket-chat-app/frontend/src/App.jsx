import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';

const ROOMS = ['General', 'Technology', 'Random', 'Gaming'];

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('General');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('chat_history', (history) => {
      setMessages(history);
    });

    socketRef.current.on('room_users', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('user_joined', ({ username: name }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), username: name, text: 'joined the room', type: 'system', time: new Date().toLocaleTimeString() },
      ]);
    });

    socketRef.current.on('user_left', ({ username: name }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), username: name, text: 'left the room', type: 'system', time: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleJoin = (name, selectedRoom) => {
    setUsername(name);
    setRoom(selectedRoom);
    setCurrentRoom(selectedRoom);
    socketRef.current.emit('join_room', { username: name, room: selectedRoom });
    setJoined(true);
  };

  const handleSwitchRoom = (newRoom) => {
    setMessages([]);
    setCurrentRoom(newRoom);
    setRoom(newRoom);
    socketRef.current.emit('join_room', { username, room: newRoom });
  };

  const handleSendMessage = (text) => {
    const time = new Date().toLocaleTimeString();
    socketRef.current.emit('send_message', { username, room: currentRoom, text, time });
  };

  const handleLeave = () => {
    socketRef.current?.disconnect();
    socketRef.current = io();
    setJoined(false);
    setMessages([]);
    setOnlineUsers([]);
    setUsername('');
  };

  if (!joined) {
    return <JoinScreen onJoin={handleJoin} rooms={ROOMS} />;
  }

  return (
    <ChatRoom
      username={username}
      room={currentRoom}
      messages={messages}
      onlineUsers={onlineUsers}
      rooms={ROOMS}
      onSendMessage={handleSendMessage}
      onSwitchRoom={handleSwitchRoom}
      onLeave={handleLeave}
    />
  );
}

export default App;
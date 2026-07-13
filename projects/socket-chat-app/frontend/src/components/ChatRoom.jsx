import { useState } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatRoom.css';

export default function ChatRoom({
  username,
  room,
  messages,
  onlineUsers,
  rooms,
  onSendMessage,
  onSwitchRoom,
  onLeave,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="chat-room">
      <Sidebar
        username={username}
        currentRoom={room}
        rooms={rooms}
        onlineUsers={onlineUsers}
        onSwitchRoom={onSwitchRoom}
        onLeave={onLeave}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="chat-main">
        <div className="chat-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="chat-header-info">
            <h2 className="chat-header-room">#{room}</h2>
            <span className="chat-header-users">{onlineUsers.length} online</span>
          </div>
        </div>
        <MessageList messages={messages} username={username} />
        <MessageInput onSend={onSendMessage} />
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
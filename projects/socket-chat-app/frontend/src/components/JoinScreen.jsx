import { useState } from 'react';
import './JoinScreen.css';

export default function JoinScreen({ onJoin, rooms }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(rooms[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    onJoin(username.trim(), room);
  };

  return (
    <div className="join-screen">
      <div className="join-card">
        <h1 className="join-title">SimpleChat</h1>
        <p className="join-subtitle">Join a room and start chatting</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="room">Room</label>
            <select id="room" value={room} onChange={(e) => setRoom(e.target.value)}>
              {rooms.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="join-btn" disabled={!username.trim()}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
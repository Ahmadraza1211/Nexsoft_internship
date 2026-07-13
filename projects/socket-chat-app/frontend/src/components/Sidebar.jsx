import './Sidebar.css';

export default function Sidebar({
  username,
  currentRoom,
  rooms,
  onlineUsers,
  onSwitchRoom,
  onLeave,
  isOpen,
  onClose,
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">SimpleChat</h1>
        <button className="sidebar-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{username[0]?.toUpperCase()}</div>
        <div className="user-info">
          <div className="user-name">{username}</div>
          <div className="user-status">Online</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-label">Rooms</div>
        <ul className="room-list">
          {rooms.map((r) => (
            <li
              key={r}
              className={`room-item ${r === currentRoom ? 'room-active' : ''}`}
              onClick={() => {
                onSwitchRoom(r);
                onClose();
              }}
            >
              <span className="room-hash">#</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-label">
          Online — {onlineUsers.length}
        </div>
        <ul className="user-list">
          {onlineUsers.map((u) => (
            <li key={u} className="user-list-item">
              <span className="online-dot" />
              {u}
              {u === username && <span className="you-tag"> (you)</span>}
            </li>
          ))}
        </ul>
      </div>

      <button className="leave-btn" onClick={onLeave}>
        Leave Room
      </button>
    </aside>
  );
}
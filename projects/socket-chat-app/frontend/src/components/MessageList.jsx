import { useEffect, useRef } from 'react';
import './MessageList.css';

export default function MessageList({ messages, username }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="message-list-empty">No messages yet. Say hello!</div>
      )}
      {messages.map((msg) => {
        if (msg.type === 'system') {
          return (
            <div key={msg.id} className="message-system">
              <span>{msg.username}</span> {msg.text}
            </div>
          );
        }

        const isOwn = msg.username === username;

        return (
          <div key={msg.id} className={`message-row ${isOwn ? 'message-own' : ''}`}>
            <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
              <div className="message-author">{msg.username}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
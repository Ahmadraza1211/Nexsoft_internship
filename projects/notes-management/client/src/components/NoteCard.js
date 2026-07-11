import React, { useState } from 'react';
import '../styles/NoteCard.css';

function NoteCard({ note, onEdit, onDelete, onUpdate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const colorMap = {
        yellow: '#FFE066',
        blue: '#74C0FC',
        green: '#69DB7C',
        pink: '#FFB3BA',
        purple: '#B197FC',
        orange: '#FFA94D'
    };

    const handlePin = () => {
        onUpdate(note.id, { isPinned: !note.isPinned });
    };

    const handleFavorite = () => {
        onUpdate(note.id, { isFavorite: !note.isFavorite });
    };

    return (
        <div
            className={`note-card ${isExpanded ? 'expanded' : ''}`}
            style={{ backgroundColor: colorMap[note.color] }}
        >
            <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-icons">
                    <button
                        className={`icon-btn favorite ${note.isFavorite ? 'active' : ''}`}
                        onClick={handleFavorite}
                        title="Add to favorites"
                    >
                        ★
                    </button>
                    <button
                        className={`icon-btn pin ${note.isPinned ? 'active' : ''}`}
                        onClick={handlePin}
                        title="Pin note"
                    >
                        📌
                    </button>
                </div>
            </div>

            <div className="note-meta">
                <span className="category-tag">{note.category}</span>
                {note.tags && (
                    <span className="tags">{note.tags}</span>
                )}
            </div>

            <div className={`note-content ${isExpanded ? 'full' : 'preview'}`}>
                {note.content}
            </div>

            <div className="note-footer">
                <span className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                <div className="note-actions">
                    <button
                        className="btn-expand"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Collapse' : 'View'}
                    </button>
                    <button
                        className="btn-edit"
                        onClick={() => onEdit(note)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => onDelete(note.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NoteCard;

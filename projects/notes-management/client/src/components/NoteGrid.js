import React from 'react';
import NoteCard from './NoteCard';
import '../styles/NoteGrid.css';

function NoteGrid({ notes, onEditNote, onDeleteNote, onUpdateNote }) {
    if (notes.length === 0) {
        return (
            <div className="empty-state">
                <p>No notes found. Create your first note!</p>
            </div>
        );
    }

    return (
        <div className="note-grid">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEditNote}
                    onDelete={onDeleteNote}
                    onUpdate={onUpdateNote}
                />
            ))}
        </div>
    );
}

export default NoteGrid;

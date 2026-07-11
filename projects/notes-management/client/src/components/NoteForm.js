import React, { useState, useEffect } from 'react';
import '../styles/NoteForm.css';

function NoteForm({ onAddNote, onUpdateNote, editingNote, onCancelEdit, categories }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('yellow');
    const [category, setCategory] = useState('General');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setColor(editingNote.color);
            setCategory(editingNote.category);
            setTags(editingNote.tags);
        } else {
            resetForm();
        }
    }, [editingNote]);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setColor('yellow');
        setCategory('General');
        setTags('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        if (editingNote) {
            onUpdateNote(editingNote.id, {
                title: title.trim(),
                content: content.trim(),
                color,
                category,
                tags
            });
        } else {
            onAddNote({
                title: title.trim(),
                content: content.trim(),
                color,
                category,
                tags
            });
        }

        resetForm();
    };

    const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];

    return (
        <div className="note-form">
            <h3>{editingNote ? 'Edit Note' : 'Add New Note'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter note title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your notes here..."
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Work, Personal, Ideas"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., important, urgent, review"
                    />
                </div>

                <div className="form-group">
                    <label>Color</label>
                    <div className="color-picker">
                        {colors.map(c => (
                            <button
                                key={c}
                                type="button"
                                className={`color-option ${c} ${color === c ? 'selected' : ''}`}
                                onClick={() => setColor(c)}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {editingNote ? 'Update Note' : 'Add Note'}
                    </button>
                    {editingNote && (
                        <button type="button" className="cancel-btn" onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default NoteForm;

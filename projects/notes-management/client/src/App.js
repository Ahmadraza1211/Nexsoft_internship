import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteForm from './components/NoteForm';
import NoteGrid from './components/NoteGrid';
import Statistics from './components/Statistics';
import './App.css';

function App() {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    const API_URL = 'http://localhost:5001/api';

    useEffect(() => {
        fetchNotes();
        fetchCategories();
        fetchStats();
    }, [selectedCategory]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/notes`;
            if (selectedCategory !== 'all') {
                url += `?category=${selectedCategory}`;
            }
            const response = await axios.get(url);
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/statistics`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleAddNote = async (noteData) => {
        try {
            await axios.post(`${API_URL}/notes`, noteData);
            fetchNotes();
            fetchCategories();
            fetchStats();
        } catch (error) {
            alert('Error adding note: ' + error.message);
        }
    };

    const handleUpdateNote = async (id, updates) => {
        try {
            await axios.put(`${API_URL}/notes/${id}`, updates);
            fetchNotes();
            fetchStats();
            setEditingNote(null);
        } catch (error) {
            alert('Error updating note: ' + error.message);
        }
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await axios.delete(`${API_URL}/notes/${id}`);
                fetchNotes();
                fetchStats();
            } catch (error) {
                alert('Error deleting note: ' + error.message);
            }
        }
    };

    const getFilteredNotes = () => {
        return notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Notes Management System</h1>
                <p>Keep your thoughts organized and accessible</p>
            </header>

            <main className="app-main">
                <div className="container">
                    <aside className="sidebar">
                        <NoteForm
                            onAddNote={handleAddNote}
                            categories={categories}
                            editingNote={editingNote}
                            onUpdateNote={handleUpdateNote}
                            onCancelEdit={() => setEditingNote(null)}
                        />
                        <Statistics stats={stats} />
                    </aside>

                    <section className="main-content">
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="category-section">
                            <h2>Categories</h2>
                            <div className="category-buttons">
                                <button
                                    className={selectedCategory === 'all' ? 'category-btn active' : 'category-btn'}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All Notes
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading">Loading notes...</div>
                        ) : (
                            <NoteGrid
                                notes={getFilteredNotes()}
                                onEditNote={setEditingNote}
                                onDeleteNote={handleDeleteNote}
                                onUpdateNote={handleUpdateNote}
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;

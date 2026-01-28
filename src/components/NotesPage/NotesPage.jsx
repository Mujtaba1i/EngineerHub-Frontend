import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as noteService from '../../services/noteService';
import NoteCard from '../NoteCard/NoteCard';
import styles from './NotesPage.module.css';

const NotesPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    if (!user || (user.role !== 'student' && user.role !== 'graduate')) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes(filters);
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleClearFilters = () => {
    setFilters({ course_code: '', year: '', search: '' });
    setTimeout(fetchNotes, 0);
  };

  const handleNoteUpdate = () => {
    fetchNotes();
  };

  if (loading) {
    return <div className={styles.loading}>Loading notes...</div>;
  }

  return (
    <main className={styles.notesPage}>
      <div className={styles.header}>
        <h1>Study Notes Library</h1>
        <Link to='/notes/upload' className={styles.uploadButton}>
          + Upload Note
        </Link>
      </div>

      <form onSubmit={handleSearch} className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            name="search"
            placeholder="Search by title, description, or doctor..."
            value={filters.search}
            onChange={handleFilterChange}
            className={styles.searchInput}
          />
        </div>

        <button type="submit" className={styles.searchButton}>
          Search
        </button>
        <button 
          type="button" 
          onClick={handleClearFilters}
          className={styles.clearButton}
        >
          Clear
        </button>
      </form>

      {notes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No notes found</p>
        </div>
      ) : (
        <div className={styles.notesList}>
          {notes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onUpdate={handleNoteUpdate}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default NotesPage;
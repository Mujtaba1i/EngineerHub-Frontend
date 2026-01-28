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
  const [orphanedFiles, setOrphanedFiles] = useState([]);
  const [showOrphanedFiles, setShowOrphanedFiles] = useState(false);
  const [filters, setFilters] = useState({
    course_code: '',
    year: '',
    search: ''
  });

  // Redirect if not student/graduate
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

  const checkOrphanedFiles = async () => {
    try {
      const result = await noteService.listOrphanedFiles();
      if (result.files && result.files.length > 0) {
        setOrphanedFiles(result.files);
      }
    } catch (error) {
      console.error('Failed to check for orphaned files:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    checkOrphanedFiles();
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
    checkOrphanedFiles();
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

      {/* Filters */}
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
        <div className={styles.filterGroup}>
          <input
            type="text"
            name="course_code"
            placeholder="Course Code (e.g., CS101)"
            value={filters.course_code}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <input
            type="number"
            name="year"
            placeholder="Year (e.g., 2024)"
            value={filters.year}
            onChange={handleFilterChange}
            className={styles.filterInput}
            min="2000"
            max="2100"
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

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No notes found</p>
          <Link to='/notes/upload' className={styles.uploadLink}>
            Be the first to upload!
          </Link>
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
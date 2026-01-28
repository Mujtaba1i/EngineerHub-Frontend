import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as noteService from '../../services/noteService';
import styles from './RecoverNote.module.css';

const RecoverNote = () => {
  const { user } = useContext(UserContext);
  const { encodedFileKey } = useParams();
  const navigate = useNavigate();

  const [fileKey] = useState(() => {
    try {
      return atob(encodedFileKey);
    } catch {
      return '';
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    course_name: '',
    year: new Date().getFullYear(),
    doctor_name: '',
    description: ''
  });

  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not authorized
  useEffect(() => {
    if (!user || (user.role !== 'student' && user.role !== 'graduate')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!fileKey) {
    return (
      <div className={styles.errorPage}>
        <p>Invalid file reference</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.course_code.trim()) {
      setError('Please enter a course code');
      return;
    }
    if (!formData.doctor_name.trim()) {
      setError('Please enter the doctor/instructor name');
      return;
    }

    try {
      setRecovering(true);
      setError('');

      // Call backend to recover the file
      const result = await noteService.recoverFile(fileKey, formData);

      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/notes');
      }, 2000);
    } catch (err) {
      console.error('Recovery failed:', err);
      setError(err.message || 'Failed to recover file');
    } finally {
      setRecovering(false);
    }
  };

  if (success) {
    return (
      <main className={styles.successPage}>
        <div className={styles.successContent}>
          <h1>✅ File Recovered!</h1>
          <p>Your note has been successfully linked to your account.</p>
          <p>Redirecting to notes page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.recoverPage}>
      <div className={styles.container}>
        <h1>Complete Your Note Metadata</h1>
        <p className={styles.description}>
          This file was uploaded to Azure but wasn't linked to a note yet. Fill in the details below to complete the upload.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fileInfo}>
            <p>📎 <strong>File:</strong> {fileKey.split('/').pop()}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 3 Notes - Data Structures"
              required
              disabled={recovering}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="course_code">Course Code *</label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                placeholder="e.g., CS101"
                required
                disabled={recovering}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                required
                disabled={recovering}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="course_name">Course Name</label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              placeholder="e.g., Introduction to Computer Science"
              disabled={recovering}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="doctor_name">Doctor Name *</label>
            <input
              type="text"
              id="doctor_name"
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleChange}
              placeholder="e.g., Dr. Ahmed Ali"
              required
              disabled={recovering}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about this note..."
              rows="4"
              disabled={recovering}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={recovering}
            >
              {recovering ? '⏳ Linking...' : '🔗 Link File to Note'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/notes')}
              className={styles.cancelBtn}
              disabled={recovering}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RecoverNote;

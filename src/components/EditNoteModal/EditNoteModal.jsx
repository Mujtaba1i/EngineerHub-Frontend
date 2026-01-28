import { useState } from 'react';
import * as noteService from '../../services/noteService';
import styles from './EditNoteModal.module.css';

const EditNoteModal = ({ note, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: note.title,
    course_code: note.course_code,
    course_name: note.course_name || '',
    year: note.year,
    doctor_name: note.doctor_name,
    description: note.description || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      const updated = await noteService.updateNote(note.id, formData);
      onSuccess(updated);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Note</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
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
                required
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
                required
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
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
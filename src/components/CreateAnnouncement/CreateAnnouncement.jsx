import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as announcementService from '../../services/announcementService';
import styles from './CreateAnnouncement.module.css';

const CreateAnnouncement = ({ classId, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    event_date: '',
    event_time: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Combine date and time into ISO format
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
      
      await announcementService.createAnnouncement({
        title: formData.title,
        content: formData.content,
        event_date: eventDateTime.toISOString(),
        class_id: parseInt(classId),
      });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to create announcement');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create Announcement</h2>
          {onClose && (
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          )}
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
              placeholder="e.g., Midterm Exam, Assignment Due"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Description *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Provide details about the exam, assignment, or event..."
              rows="5"
              required
            />
          </div>

          <div className={styles.dateTimeGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="event_date">Event Date *</label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="event_time">Event Time *</label>
              <input
                type="time"
                id="event_time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Create Announcement
            </button>
            {onClose && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
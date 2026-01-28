import { useState } from 'react';
import styles from './AnnouncementCard.module.css';

const AnnouncementCard = ({ announcement, isPast, onDelete, canDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`${styles.announcementCard} ${isPast ? styles.past : ''}`}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{announcement.title}</h4>
        <div className={styles.actionButtons}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(announcement.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className={styles.cardContent}>
          <p className={styles.description}>{announcement.content}</p>
        </div>
      )}
      
      <div className={styles.cardFooter}>
        <div className={styles.dateInfo}>
          <span className={styles.icon}>📅</span>
          <span>{formatDate(announcement.event_date)}</span>
        </div>
        {announcement.class_name && (
          <div className={styles.classInfo}>
            <span className={styles.icon}>📚</span>
            <span>{announcement.class_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
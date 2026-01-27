import { useState } from 'react';
import styles from './AnnouncementCard.module.css';

const AnnouncementCard = ({ announcement, isPast, onDelete, canDelete }) => {
  const [isExpanded, setIsExpanded] = useState(!isPast);

  // Calculate days until event
  const eventDate = new Date(announcement.event_date);
  const today = new Date();
  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  // Determine urgency level
  const getUrgencyClass = () => {
    if (isPast) return styles.past;
    if (daysUntil <= 2) return styles.urgent; // Red - 2 days or less
    if (daysUntil <= 7) return styles.soon; // Yellow - within a week
    return styles.normal; // Green - more than a week
  };

  const getUrgencyLabel = () => {
    if (isPast) return 'Past Event';
    if (daysUntil === 0) return 'Today!';
    if (daysUntil === 1) return 'Tomorrow!';
    if (daysUntil <= 2) return `${daysUntil} days left`;
    if (daysUntil <= 7) return `${daysUntil} days away`;
    return `${daysUntil} days away`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`${styles.card} ${getUrgencyClass()} ${!isExpanded ? styles.compact : ''}`}>
      <div className={styles.header} onClick={() => isPast && setIsExpanded(!isExpanded)}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{announcement.title}</h3>
          <span className={styles.urgencyBadge}>{getUrgencyLabel()}</span>
        </div>
        {isPast && (
          <button className={styles.expandButton} type="button">
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <p className={styles.description}>{announcement.content}</p>
          <div className={styles.footer}>
            <div className={styles.dateInfo}>
              <span className={styles.dateLabel}>📅 {formatDate(announcement.event_date)}</span>
              <span className={styles.timeLabel}>🕐 {formatTime(announcement.event_date)}</span>
            </div>
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
      )}
    </div>
  );
};

export default AnnouncementCard;
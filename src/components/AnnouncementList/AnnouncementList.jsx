import { useEffect, useState } from 'react';
import * as announcementService from '../../services/announcementService';
import AnnouncementCard from '../AnnouncementCard/AnnouncementCard';
import styles from './AnnouncementList.module.css';

const AnnouncementList = ({ classId, canDelete = false, refresh = 0 }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (classId) {
        data = await announcementService.getClassAnnouncements(classId);
      } else {
        data = await announcementService.getMyAnnouncements();
      }
      
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [classId, refresh]);

  const handleDelete = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await announcementService.deleteAnnouncement(announcementId);
      setAnnouncements(announcements.filter(a => a.id !== announcementId));
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      alert(err.response?.data?.detail || 'Failed to delete announcement');
    }
  };

  // Separate past and upcoming announcements
  const today = new Date();
  const upcomingAnnouncements = announcements.filter(
    a => new Date(a.event_date) >= today
  );
  const pastAnnouncements = announcements.filter(
    a => new Date(a.event_date) < today
  );

  if (loading) {
    return <div className={styles.loading}>Loading announcements...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={fetchAnnouncements} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No announcements yet</p>
      </div>
    );
  }

  return (
    <div className={styles.announcementList}>
      {upcomingAnnouncements.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Upcoming Events</h3>
          {upcomingAnnouncements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isPast={false}
              onDelete={handleDelete}
              canDelete={canDelete}
            />
          ))}
        </section>
      )}

      {pastAnnouncements.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Past Events</h3>
          {pastAnnouncements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isPast={true}
              onDelete={handleDelete}
              canDelete={canDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default AnnouncementList;
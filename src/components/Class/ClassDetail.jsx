import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as classService from '../../services/classService';
import * as studentClassService from '../../services/studentClassService';
import { UserContext } from '../../contexts/UserContext';
import CreateAnnouncement from '../CreateAnnouncement/CreateAnnouncement';
import AnnouncementList from '../AnnouncementList/AnnouncementList';
import styles from './ClassDetail.module.css';

const ClassDetail = () => {
  const { user } = useContext(UserContext);
  const [cls, setCls] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [announcementRefresh, setAnnouncementRefresh] = useState(0);

  const getClass = async () => {
    try {
      const data = await classService.getOne(id);
      setCls(data);
    } catch (error) {
      console.error('Failed to fetch class:', error);
    }
  };

  useEffect(() => {
    getClass();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }
    try {
      await classService.remove(id);
      navigate('/classes');
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class');
    }
  };

  async function handleStudentDelete(student_id) {
    if (!window.confirm('Are you sure you want to remove this student?')) {
      return;
    }
    try {
      await studentClassService.removeStudentFromClass(id, student_id);
      getClass();
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Failed to remove student');
    }
  }

  const handleAnnouncementSuccess = () => {
    setShowCreateAnnouncement(false);
    // Trigger announcement list refresh
    setAnnouncementRefresh(prev => prev + 1);
  };

  if (!cls) return <div className={styles.loading}>Loading...</div>;
  
  const isDoctorOwner = cls.doctor_id === user.sub;

  if (!(user?.role === 'doctor' && parseInt(user?.sub) === cls.doctor_id)) {
    navigate('/');
    return null;
  }
  
  return (
    <main className={styles.classDetail}>
      <h2>{cls.name}</h2>
      <div className={styles.doctorInfo}>
        Doctor: {cls.doctor?.name}
      </div>

      {/* Announcements Section */}
      <section className={styles.announcementsSection}>
        <div className={styles.sectionHeader}>
          <h3>Class Announcements</h3>
          <button
            onClick={() => setShowCreateAnnouncement(true)}
            className={styles.createAnnouncementButton}
          >
            + New Announcement
          </button>
        </div>
        <AnnouncementList 
          classId={id} 
          canDelete={true} 
          refresh={announcementRefresh}
        />
      </section>

      {/* Students Section */}
      <section className={styles.section}>
        <h3>Students</h3>
        {!cls.enrollments || cls.enrollments.length === 0 ? (
          <div className={styles.emptyState}>No students enrolled yet</div>
        ) : (
          <ul className={styles.studentList}>
            {cls.enrollments.map(en => (
              <li key={en.id} className={styles.studentItem}>
                <span className={styles.studentName}>{en.student?.name}</span>
                <button 
                  onClick={() => handleStudentDelete(en.student.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <Link to={`/classes/${id}/edit`} className={`${styles.actionLink} ${styles.editLink}`}>
          Edit Class
        </Link>
        <Link to={`/classes/${id}/add-student`} className={`${styles.actionLink} ${styles.addStudentLink}`}>
          Add Student
        </Link>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete Class
        </button>
      </div>

      {/* Create Announcement Modal */}
      {showCreateAnnouncement && (
        <CreateAnnouncement
          classId={id}
          onClose={() => setShowCreateAnnouncement(false)}
          onSuccess={handleAnnouncementSuccess}
        />
      )}
    </main>
  );
};

export default ClassDetail;
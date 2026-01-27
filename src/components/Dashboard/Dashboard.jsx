import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router';
import * as classService from '../../services/classService';
import AnnouncementList from '../AnnouncementList/AnnouncementList';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');

  async function getClasses() {
    const response = await classService.getStudentClasses();
    setClasses(response);
  }
  
  useEffect(() => {
    if (user.role === 'student' || user.role === 'graduate') {
      getClasses();
    }
  }, []);

  return (
    <main className={styles.dashboard}>
      <h1>Welcome, {user.name}</h1>
      
      {user.role === 'doctor' && (
        <div className={styles.quickLinks}>
          <div className={styles.linkCard}>
            <Link to='/classes'>View All Classes</Link>
          </div>
          <div className={styles.linkCard}>
            <Link to='/classes/new'>Create a New Class</Link>
          </div>
        </div>
      )}

      {(user.role === 'student' || user.role === 'graduate') && (
        <>
          <section className={styles.announcementsSection}>
            <h2 className={styles.sectionHeader}>Your Announcements</h2>
            <AnnouncementList />
          </section>

          <section className={styles.classesSection}>
            <h3 className={styles.sectionHeader}>Your Classes</h3>
            {classes.length > 0 ? (
              <ul className={styles.classList}>
                {classes.map(cls => (
                  <li key={cls.id} className={styles.classItem}>
                    <Link to={'/student-class/' + cls.class_.id}>
                      {cls.class_.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                No classes enrolled yet
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
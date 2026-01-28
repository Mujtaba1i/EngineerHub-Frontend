import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router';
import * as classService from '../../services/classService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function getClasses() {
    const response = await classService.getStudentClasses();
    setClasses(response);
  }
  
  useEffect(() => {
    if (user.role === 'student' || user.role === 'graduate') {
      getClasses();
    }
  }, []);
    useEffect(() => {
    if (user.role === 'institution') {
      navigate('/posts');
    }
  }, [user.role, navigate]);


  return (
    <main className={styles.dashboard}>
      <div className={styles.headerSection}>
        <h1>Welcome, {user.name}</h1>
        <div className={styles.headerDecor}></div>
      </div>
      
      {user.role === 'doctor' && (
        <div className={styles.quickLinks}>
          <Link to='/classes' className={styles.linkCard}>
            <div className={styles.cardIcon}>📚</div>
            <div className={styles.cardContent}>
              <span className={styles.cardTitle}>View All Classes</span>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Link>

          <Link to='/classes/new' className={styles.linkCard}>
            <div className={styles.cardIcon}>✏️</div>
            <div className={styles.cardContent}>
              <span className={styles.cardTitle}>Create New Class</span>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Link>
        </div>
      )}



      {(user.role === 'student' || user.role === 'graduate') && (
        <section className={styles.classesSection}>
          <div className={styles.sectionTitle}>
            <div className={styles.titleIcon}>🎓</div>
            <h3>Your Classes</h3>
          </div>
          {classes.length > 0 ? (
            <div className={styles.classGrid}>
              {classes.map(cls => (
                <div key={cls.id} className={styles.classCard}>
                  <div className={styles.classCardHeader}>
                    <div className={styles.classIcon}>⚙️</div>
                  </div>
                  <Link to={'/student-class/' + cls.class_.id}>
                    <h4>{cls.class_.name}</h4>
                    <span className={styles.viewDetails}>View Details →</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p>No classes enrolled yet</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Dashboard;
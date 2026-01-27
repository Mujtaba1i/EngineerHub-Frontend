import { Link } from 'react-router';
import * as classService from '../../services/classService';
import { useEffect, useState } from 'react';
import styles from './ClassList.module.css';

const ClassList = () => {
  const [classes, setClasses] = useState([]);

  async function getClss() {
    const allClasses = await classService.getAll();
    setClasses(allClasses);
  }

  useEffect(() => {
    getClss();
  }, []);
  
  return (
    <main className={styles.classListContainer}>
      <h1>All Classes</h1>

      {!classes.length ? (
        <div className={styles.emptyState}>
          No classes found
        </div>
      ) : (
        <ul className={styles.classList}>
          {classes.map(cls => (
            <li key={cls.id} className={styles.classItem}>
              <Link to={`/classes/${cls.id}`}>
                {cls.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ClassList;
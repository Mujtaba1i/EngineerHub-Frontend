import { Link, useNavigate } from 'react-router';
import * as classService from '../../services/classService';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from './ClassList.module.css';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const { user } = useContext(UserContext);

  const navigate = useNavigate()
  async function getClss() {
    const allClasses = await classService.getAll();
    setClasses(allClasses);
  }

  useEffect(() => {
    getClss();
  }, []);

  const doctorClasses = classes.filter(
    cls => cls.doctor_id === Number(user.sub)
  );

  const userRole = user?.role;
  if(userRole !== 'doctor') {
    useEffect(() => {
      navigate('/')
    }, [])
  }

  return (
    <main className={styles.classListContainer}>
      <h1>My Classes</h1>

      {!doctorClasses.length ? (
        <div className={styles.emptyState}>
          No classes found
        </div>
      ) : (
        <ul className={styles.classList}>
          {doctorClasses.map(cls => (
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

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as classService from '../../services/classService';
import * as studentClassService from '../../services/studentClassService';
import { UserContext } from '../../contexts/UserContext';
import styles from './ClassDetail.module.css';

const ClassDetail = () => {
  const { user } = useContext(UserContext);
  const [cls, setCls] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getClass = async () => {
    const data = await classService.getOne(id);
    setCls(data);
  };

  useEffect(() => {
    getClass();
  }, []);

  const handleDelete = async () => {
    await classService.remove(id);
    navigate('/classes');
  };

  async function handleStudentDelete(student_id) {
    const res = await studentClassService.removeStudentFromClass(id, student_id);
    getClass();
  }

  if (!cls) return <div className={styles.loading}>Loading...</div>;
  
  const isDoctorOwner = cls.doctor_id === user.sub;

  if (!(user?.role === 'doctor' && parseInt(user?.sub) === cls.doctor_id)) {
    navigate('/');
  }
  
  return (
    <main className={styles.classDetail}>
      <h2>{cls.name}</h2>
      <div className={styles.doctorInfo}>
        Doctor: {cls.doctor?.name}
      </div>

      <section className={styles.section}>
        <h3>Students</h3>
        {!cls.enrollments.length ? (
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

      {true && (
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
      )}
    </main>
  );
};

export default ClassDetail;
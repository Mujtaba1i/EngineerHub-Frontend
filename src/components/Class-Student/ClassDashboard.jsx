import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as classSerive from '../../services/classService';
import { useNavigate, useParams } from "react-router";
import { removeStudentFromClass } from '../../services/studentClassService';
import styles from './ClassDashboard.module.css';

function ClassDashboard() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState('');
  const [students, setStudents] = useState('');
  const [doctor, setDoctor] = useState('');

  async function getClassData() {
    const response = await classSerive.getOne(id);
    setDoctor(response.doctor);
    setStudents(response.enrollments);
    setClassData(response);
  }

  useEffect(() => {
    getClassData();
  }, []);

  const handleLeave = async () => {
    const res = await removeStudentFromClass(id, Number(user.sub));
    navigate('/');
  };

  return (
    <main className={styles.classDashboard}>
      <h2>{classData.name}</h2>

      <div className={styles.doctorInfo}>
        <p>
          Doctor: <strong>{doctor.name}</strong>
        </p>
      </div>

      <section className={styles.section}>
        <h3>Students</h3>
        {!students.length ? (
          <div className={styles.emptyState}>No students enrolled</div>
        ) : (
          <ul className={styles.studentList}>
            {classData.enrollments.map((enroll) => (
              <li key={enroll.id} className={styles.studentItem}>
                {enroll.student.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(user?.role === "student" || user.role === 'graduate') && (
        <button onClick={handleLeave} className={styles.leaveButton}>
          Leave Class
        </button>
      )}
    </main>
  );
}

export default ClassDashboard;
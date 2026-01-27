import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { addStudentToClass } from "../../services/studentClassService";
import { useNavigate, useParams } from "react-router";
import styles from './AddStudent.module.css';

const AddStudent = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  const isOwnerDoctor = user?.role === "DOCTOR" && user.id === doctorId;

  // if (!isOwnerDoctor) navigate('/');

  function handleChange(event) {
    setStudentId(event.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await addStudentToClass({
      student_id: Number(studentId),
      class_id: Number(id),
    });
    navigate(`/classes/${id}`);
  };

  return (
    <main className={styles.addStudentContainer}>
      <h1>Add Student</h1>
      <div className={styles.infoBox}>
        Enter the student's ID to add them to this class
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="studentId">Student ID:</label>
          <input
            id="studentId"
            type="number"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Add Student</button>
      </form>
    </main>
  );
};

export default AddStudent;
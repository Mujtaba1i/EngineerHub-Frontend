import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as classService from '../../services/classService';
import { addStudentToClass } from "../../services/studentClassService";
import { useNavigate, useParams } from "react-router";
import styles from './AddStudent.module.css';

const AddStudent = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [studentId, setStudentId] = useState("");
  const [cls, setCls] = useState(null);
  const navigate = useNavigate();

  const getClass = async () => {
    try {
      const data = await classService.getOne(id);
      setCls(data);
    } catch (error) {
      console.error('Failed to fetch class:', error);
    }
  };
  useEffect(()=>{
    getClass()
  },[])

    useEffect(() => {
    if (!user || !cls) return;

    const isOwnerDoctor = user.role === "doctor" && parseInt(user.sub) === cls.doctor_id;

    if (!isOwnerDoctor) {
      navigate("/");
    }
  }, [user, cls, navigate]);

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

  if (!user || !cls) {
    return <div>Loading...</div>;
  }

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
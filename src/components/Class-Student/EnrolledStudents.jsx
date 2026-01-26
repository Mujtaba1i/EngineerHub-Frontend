import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { removeStudentFromClass } from "../../services/studentClassService";
import * as classSerive from '../../services/classService'

const EnrolledStudents = () => {
  const { user } = useContext(UserContext);

  const isOwnerDoctor =
    user?.role === "DOCTOR" && user.id === classData.doctor_id;

  const handleRemove = async (studentId) => {
    await removeStudentFromClass(classData.id, studentId);
    refresh();
  };

  return (
    <div>
      <h3>Enrolled Students</h3>

      {!classData.enrollments.length ? (
        <p>No students yet</p>
      ) : (
        <ul>
          {classData.enrollments.map((enroll) => (
            <li key={enroll.id}>
              {enroll.student.name}

              {isOwnerDoctor && (
                <button onClick={() => handleRemove(enroll.student.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrolledStudents;

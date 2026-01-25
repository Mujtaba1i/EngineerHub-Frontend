import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { addStudentToClass } from "../../services/studentClassService";
import { useNavigate } from "react-router";

const AddStudent = ({ classId, doctorId, refresh }) => {
  const { user } = useContext(UserContext);
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate()

  const isOwnerDoctor =
    user?.role === "DOCTOR" && user.id === doctorId;

  if (!isOwnerDoctor) navigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addStudentToClass({
      student_id: Number(studentId),
      class_id: classId,
    });

    setStudentId("");
    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button type="submit">Add Student</button>
    </form>
  );
};

export default AddStudent;

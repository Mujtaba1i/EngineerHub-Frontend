import { useState, useContext, use } from "react";
import { UserContext } from "../../contexts/UserContext";
import { addStudentToClass } from "../../services/studentClassService";
import { useNavigate, useParams } from "react-router";

const AddStudent = () => {
  const {id} = useParams()
  const { user } = useContext(UserContext);
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate()

  const isOwnerDoctor =
    user?.role === "DOCTOR" && user.id === doctorId;

  // if (!isOwnerDoctor) navigate('/');

  function handleChange(event){
    setStudentId(event.target.value) 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await addStudentToClass({
      student_id: Number(studentId),
      class_id: Number(id),
    });
    navigate(`/classes/${id}`)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Student ID"
        value={studentId}
        onChange={handleChange}
      />
      <button type="submit">Add Student</button>
    </form>
  );
};

export default AddStudent;

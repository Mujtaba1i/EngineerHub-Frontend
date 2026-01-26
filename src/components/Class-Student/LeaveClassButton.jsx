import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { removeStudentFromClass } from "../../services/studentClassService";
import { useNavigate } from "react-router";

const LeaveClassButton = ({ classId, refresh }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  if (user?.role !== "STUDENT") navigate('/');

  

  return <button onClick={handleLeave}>Leave Class</button>;
};

export default LeaveClassButton;

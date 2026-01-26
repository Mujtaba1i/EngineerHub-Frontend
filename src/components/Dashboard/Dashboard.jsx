import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router';
import * as classService from '../../services/classService'

const Dashboard = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);
  const [classes,setClasses] = useState([])

  // Create state to store the message we'll receive from the backend
  const [ message, setMessage ] = useState('');

  async function getClasses(){
    const response = await classService.getStudentClasses()
    setClasses(response)
  }
  useEffect(()=>{getClasses()},[])

  // useEffect runs after the component renders
  // This is where we perform side effects like API calls
  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      {user.role === 'doctor' && (
      <ul>
        <li><Link to='/classes'>Classes</Link></li>
        <li><Link to='/classes/new'>Create a new class</Link></li>
      </ul>
      )}

      {user.role === 'student' && (<>
        <h3>Your Classes:</h3>
        <ul>
        {classes.map(cls =>(
          <li key={cls.id}>
            <Link to={'/student-class/'+cls.class_.id}>{cls.class_.name}</Link>

          </li>
        ))}
        </ul>
        </>
      )}
    </main>
  );
};

export default Dashboard;

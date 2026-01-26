import { useEffect, useState, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router';


const Dashboard = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);

  // Create state to store the message we'll receive from the backend
  const [ message, setMessage ] = useState('');

  // useEffect runs after the component renders
  // This is where we perform side effects like API calls
  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>
        This is the dashboard page where you can test your authentication.
      </p>

      <ul>
        <li><Link to='/classes'>Classes</Link></li>
        <li><Link to='/classes/new'>Create a new class</Link></li>
      </ul>

    </main>
  );
};

export default Dashboard;

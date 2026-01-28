import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  const canAccessNotes = user && (user.role === 'student' || user.role === 'graduate');

  // The nav bar gets the user from the context which is either
  // {username, sub} if logged in or null if not, and shows
  // set of the correct set of links
  return (
    <header className={styles.navbar}>
      <nav>
        {user ? (
          <ul>
            <li className={styles.logo}>EngineerHub</li>
            <li><Link to='/'>Dashboard</Link></li>
            {canAccessNotes && (
              <li><Link to='/notes' className={styles.notesLink}>📚 Notes</Link></li>
            )}
            <li><Link to='/projects'>Senior Projects</Link></li>
            <li>Welcome, {user.name}</li>
            <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
          </ul>
        ) : (
          <ul>
            <li className={styles.logo}>EngineerHub</li>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/sign-in'>Sign In</Link></li>
            <li><Link to='/sign-up'>Sign Up</Link></li>
            <li><Link to='/projects'>Senior Projects</Link></li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
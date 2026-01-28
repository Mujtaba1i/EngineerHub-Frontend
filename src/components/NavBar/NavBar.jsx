import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const canAccessNotes = user && (user.role === 'student' || user.role === 'graduate');
  const isInstitution = user && user.role === 'institution';
  const canAccessPosts = user;

  return (
    <header className={styles.navbar}>
      <nav>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>⚙️</div>
            <span className={styles.logoText}>EngineerHub</span>
          </Link>

          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
          </button>

          {user ? (
            <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`} aria-hidden={!isMenuOpen}>
              <li className={styles.welcomeText}>
                <span className={styles.welcomeIcon}>👤</span>
                Welcome, {user.name}
              </li>
              <li><Link to='/' onClick={closeMenu}>Dashboard</Link></li>
              {canAccessNotes && <li><Link to='/notes' onClick={closeMenu}>Notes</Link></li>}
              {canAccessPosts && (
                <li>
                  <Link to='/posts' onClick={closeMenu}>
                    {isInstitution ? 'My Posts' : 'Posts'}
                  </Link>
                </li>
              )}
              <li><Link to='/projects' onClick={closeMenu}>Senior Projects</Link></li>
              <li>
                <Link to='/' onClick={handleSignOut} className={styles.signOut}>
                  Sign Out
                </Link>
              </li>
            </ul>
          ) : (
            <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`} aria-hidden={!isMenuOpen}>
              <li><Link to='/' onClick={closeMenu}>Home</Link></li>
              <li><Link to='/sign-in' onClick={closeMenu}>Sign In</Link></li>
              <li><Link to='/sign-up' onClick={closeMenu}>Sign Up</Link></li>
              <li><Link to='/projects' onClick={closeMenu}>Senior Projects</Link></li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;

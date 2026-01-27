import { Link } from 'react-router';
import styles from './Landing.module.css';

// This page is a simple component that just loads when the page first loads and you are not signed in
const Landing = () => {
  return (
    <main className={styles.landing}>
      <div className={styles.container}>
        <h1>EngineerHub</h1>
        <p className={styles.subtitle}>Your Engineering Education Hub</p>
        <p>Sign up now, or sign in to see your super secret dashboard!</p>
        
        <div className={styles.ctaButtons}>
          <Link to='/sign-up' className={`${styles.ctaButton} ${styles.primaryButton}`}>
            Get Started
          </Link>
          <Link to='/sign-in' className={`${styles.ctaButton} ${styles.secondaryButton}`}>
            Sign In
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>View Your Classes</div>
            <p className={styles.featureDescription}>
              Access all your engineering courses in one place
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Get Announcements</div>
            <p className={styles.featureDescription}>
              Stay updated with important class notifications
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Track Progress</div>
            <p className={styles.featureDescription}>
              Monitor your academic journey and achievements
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
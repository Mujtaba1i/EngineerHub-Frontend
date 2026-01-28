import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import styles from './SignInForm.module.css';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <main className={styles.signInContainer}>
      <h1>Sign In</h1>
      <p className={styles.message}>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            autoComplete='off'
            id='name'
            value={formData.name}
            name='name'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.signInButton}>Sign In</button>
          <button className={styles.cancelButton} type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
      <p className={styles.signUpPrompt}>
        Don't have an account? <Link to='/sign-up'>Sign Up</Link>
      </p>
    </main>
  );
};

export default SignInForm;
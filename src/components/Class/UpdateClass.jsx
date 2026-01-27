import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as classService from '../../services/classService';
import styles from './UpdateClass.module.css';

const UpdatClass = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    getdata();
  }, []);
  
  async function getdata() {
    const data = await classService.getOne(id);
    setFormState(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await classService.update(id, {
      name: formState.name
    });
    navigate('/classes');
  };

  const handleChange = (e) => {
    setFormState({ ...formState, name: e.target.value });
  };

  if (!formState) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.updateClassContainer}>
      <h1>Update Class</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="className">Class Name:</label>
          <input
            id="className"
            type="text"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Update Class</button>
      </form>
    </main>
  );
};

export default UpdatClass;
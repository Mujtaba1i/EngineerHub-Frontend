import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as classService from '../../services/classService';
import styles from './CreateClass.module.css';

const CreateClass = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await classService.create({
      name: formState.name
    });
    navigate('/classes');
  };

  const handleChange = (e) => {
    setFormState({ ...formState, name: e.target.value });
  };

  return (
    <main className={styles.createClassContainer}>
      <h1>Create New Class</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="className">Class Name:</label>
          <input
            id="className"
            type="text"
            value={formState.name}
            onChange={handleChange}
            placeholder="Enter class name"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Create Class</button>
      </form>
    </main>
  );
};

export default CreateClass;
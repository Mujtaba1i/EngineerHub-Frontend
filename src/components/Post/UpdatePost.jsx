import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as postService from '../../services/postService';
import styles from './UpdatePost.module.css';
import { UserContext } from '../../contexts/UserContext';

const UpdatePost = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(null);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  
  useEffect(() => {
    getData();
  }, []);
  
  async function getData() {
    try {
      const data = await postService.getOne(id);
      setFormState(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.update(id, {
        title: formState.title,
        description: formState.description,
        image_url: formState.image_url || undefined
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  useEffect(() => {
    if ((!user || user?.role !== 'institution') && formState?.institute_id !== parseInt(user.sub)) {
      navigate('/');
    }
  }, [user, navigate]);



  if (!formState) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.updatePostContainer}>
      <h1>Update Post</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formState.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image_url">Image URL (optional):</label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            value={formState.image_url || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Update Post</button>
      </form>
    </main>
  );
};

export default UpdatePost;
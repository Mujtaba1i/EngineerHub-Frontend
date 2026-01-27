import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as postService from '../../services/postService';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ 
    title: '', 
    description: '', 
    image_url: '' 
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.create({
        title: formState.title,
        description: formState.description,
        image_url: formState.image_url || undefined
      });
      navigate('/posts');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <main className={styles.createPostContainer}>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formState.title}
            onChange={handleChange}
            placeholder="Enter post title"
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
            placeholder="Enter post description"
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
            value={formState.image_url}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </div>

        <button type="submit" className={styles.submitButton}>Create Post</button>
      </form>
    </main>
  );
};

export default CreatePost;
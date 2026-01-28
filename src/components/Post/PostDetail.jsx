import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as postService from '../../services/postService';
import { UserContext } from '../../contexts/UserContext';
import styles from './PostDetail.module.css';

const PostDetail = () => {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getPost = async () => {
    try {
      const data = await postService.getOne(id);
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  const handleDelete = async () => {

    try {
      await postService.remove(id);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'institution' && user.role !== 'student' && user.role !== 'graduate' && user.role !== 'doctor')) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    getPost();
  }, [id]);
  if (!post) return <div className={styles.loading}>Loading...</div>;

  
  const isOwner = user?.role === 'institution' && parseInt(user?.sub) === post.institute_id;
  
  return (
    <main className={styles.postDetail}>
      <h2>{post.title}</h2>
      
      {post.image_url && (
        <div className={styles.imageContainer}>
          <img src={post.image_url} alt={post.title} className={styles.postImage} />
        </div>
      )}

      <section className={styles.section}>
        <h3>Description</h3>
        <p className={styles.description}>{post.description}</p>
      </section>

      {isOwner && (
        <div className={styles.actions}>
          <Link to={`/posts/${id}/edit`} className={`${styles.actionLink} ${styles.editLink}`}>
            Edit Post
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete Post
          </button>
        </div>
      )}
    </main>
  );
};

export default PostDetail;
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

  useEffect(() => {
    getPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await postService.remove(id);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  if (!post) return <div className={styles.loading}>Loading...</div>;
  
  // تحديد إذا المستخدم هو صاحب الـ post
  const isOwner = user?.role === 'institution' && parseInt(user?.sub) === post.institute_id;
  
  return (
    <main className={styles.postDetail}>
      <h2>{post.title}</h2>
      
      {/* عرض الصورة إذا موجودة */}
      {post.image_url && (
        <div className={styles.imageContainer}>
          <img src={post.image_url} alt={post.title} className={styles.postImage} />
        </div>
      )}

      {/* عرض الوصف */}
      <section className={styles.section}>
        <h3>Description</h3>
        <p className={styles.description}>{post.description}</p>
      </section>

      {/* أزرار التعديل والحذف - فقط لصاحب الـ post */}
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
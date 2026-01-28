import { Link, useNavigate } from 'react-router';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as postService from '../../services/postService';
import styles from './PostList.module.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  const getPosts = async () => {
    try {
      const allPosts = await postService.getAll();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(()=>{
    if (!user) navigate('/')
  })
  if(!user) return <div className={styles.loading}>Loading...</div>
  useEffect(() => {
    getPosts();
  }, []);

  const isInstitution = user?.role === 'institution';
  
  const displayPosts = isInstitution 
    ? posts.filter(post => post.institute_id === Number(user.sub))
    : posts;

  return (
    <main className={styles.postListContainer}>
      <div className={styles.header}>
        {isInstitution ? (
          <>
            <h1>My Posts</h1>
            <Link to="/posts/new" className={styles.addPostBtn}>
              + Add Post
            </Link>
          </>
        ) : (
          <h1>All Posts</h1>
        )}
      </div>

      {!displayPosts.length ? (
        <div className={styles.emptyState}>
          {isInstitution ? 'No posts found. Create your first post!' : 'No posts available'}
        </div>
      ) : (
        <ul className={styles.postList}>
          {displayPosts.map(post => (
            <li key={post.id} className={styles.postItem}>
              <Link to={`/posts/${post.id}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default PostList;
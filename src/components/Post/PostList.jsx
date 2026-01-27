import { Link } from 'react-router';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as postService from '../../services/postService';
import styles from './PostListPage.module.css';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  const getPosts = async () => {
    try {
      const allPosts = await postService.getAll();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const myPosts = posts.filter(post => post.institute_id === Number(user.sub));

  return (
    <main className={styles.postListContainer}>
      <h1>My Posts</h1>

      {!myPosts.length ? (
        <div className={styles.emptyState}>
          No posts found
        </div>
      ) : (
        <ul className={styles.postList}>
          {myPosts.map(post => (
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

export default PostListPage;

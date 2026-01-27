import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as postService from '../../services/postService';
import PostList from '../PostList/PostList';
import CreatePost from '../CreatePost/CreatePost';
import styles from './PostsDashboard.module.css';

const PostsDashboard = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const fetchPosts = async () => {
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  const handlePostSuccess = () => {
    setShowCreatePost(false);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.remove(id);
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <main className={styles.postsDashboard}>
      <h2>My Posts</h2>
      <button 
        onClick={() => setShowCreatePost(true)} 
        className={styles.createButton}
      >
        + New Post
      </button>

      <PostList posts={posts} onDelete={handleDelete} />

      {showCreatePost && (
        <CreatePost 
          onClose={() => setShowCreatePost(false)} 
          onSuccess={handlePostSuccess} 
        />
      )}
    </main>
  );
};

export default PostsDashboard;

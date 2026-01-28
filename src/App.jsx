import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

// Class components =========================================================
import ClassDetail from './components/Class/ClassDetail';
import CreateClass from './components/Class/CreateClass.jsx';
import UpdatClass from './components/Class/UpdateClass.jsx';
import ClassList from './components/Class/ClassList.jsx';

// Class-Student component =================================================
import AddStudent from './components/Class-Student/AddStudent.jsx';
import ClassDashboard from './components/Class-Student/ClassDashboard.jsx';

// Project component ========================================================
import ProjectsList from './components/Projects/ProjectsList.jsx';
import ProjectDetails from './components/Projects/ProjectDetails.jsx';
import AddProject from './components/Projects/AddProject.jsx';
import EditProject from './components/Projects/EditProject.jsx';

// Post component ==========================================================
import PostDetail from './components/Post/PostDetail.jsx';
import CreatePost from './components/Post/CreatePost.jsx';
import PostList from './components/Post/PostList.jsx';
import UpdatePost from './components/Post/UpdatePost.jsx';

import { UserContext } from './contexts/UserContext';
import styles from './App.module.css';

const App = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);

  return (
    <div className={styles.app}>
      <NavBar />
      <main className={styles.main}>
        <Routes>
          {/* if the user is logged in we have the user object else we have the user set to null */}
          <Route path='/' element={user ? <Dashboard /> : <Landing />} />
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/classes/new" element={<CreateClass />} />
          <Route path="/classes/:id/edit" element={<UpdatClass />} />
          <Route path="/classes/:id" element={<ClassDetail />} />
          <Route path="/classes/:id/add-student" element={<AddStudent />} />
          <Route path="/student-class/:id" element={<ClassDashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetails currentUser={user} />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<UpdatePost />} />

        </Routes>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          Made by Eng.Pengu
        </div>
        <div className={styles.footerCenter}>
          © {new Date().getFullYear()} EngineerHub. All rights reserved.
        </div>
        <div className={styles.footerRight}>
          Made by Eng. Help!
        </div>
      </footer>
    </div>
  );
};

export default App;
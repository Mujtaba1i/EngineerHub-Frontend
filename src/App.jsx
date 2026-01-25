import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

//Class components =========================================================
import ClassDetail from './components/Class/ClassDetail';
import ClassForm from './components/Class/ClassForm.jsx';
import ClassList from './components/class/classList';

import { UserContext } from './contexts/UserContext';

const App = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        {/* if the user is logged in we have the user object else we have the user set to null */}
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path="/classes" element={<ClassList />} />
        <Route path="/classes/new" element={<ClassForm />} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/classes/:id/edit" element={<ClassForm />} />

      </Routes>
    </>
  );
};

export default App;

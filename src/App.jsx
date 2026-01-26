import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

//Class components =========================================================
import ClassDetail from './components/Class/ClassDetail';
import CreateClass from './components/Class/CreateClass.jsx';
import UpdatClass from './components/Class/UpdateClass.jsx';
import ClassList from './components/Class/ClassList.jsx';

// Class-Student component ===============================================
import AddStudent from './components/Class-Student/AddStudent.jsx';
import ClassDashboard from './components/Class-Student/ClassDashboard.jsx';


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
        <Route path="/classes/new" element={<CreateClass />} />
        <Route path="/classes/:id/edit" element={<UpdatClass />} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/classes/:id/add-student" element={<AddStudent />}/>
        <Route path="/student-class/:id" element={<ClassDashboard />}/>


      
      </Routes>
    </>
  );
};

export default App;

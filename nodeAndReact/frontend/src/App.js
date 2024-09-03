import React, {useEffect, useState, createContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Upload_section from './components/Upload_section';
import Uploaded_images from './components/Upload_images';
import Login from './components/userAuth/UserLogin';
import Register from './components/userAuth/Register';
import PrivateRoute from './components/PrivateRoute';
import ProfileHeader from './components/user/ProfileHeader';
import Profile from './components/user/Profile';
import Api from './services/Api';

// Export AuthContext
export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  const handleLoginSuccess = (token) => {
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
  };

    const validateUser = async () => {
      const token = localStorage.getItem('token');
      if(!token)
      {
        setIsLoggedIn(false);
        return;
      }
      try {
        const data = await Api.getProfile(token);
        if (data.status) {
          // setIsLoggedIn(true);
          // setUser(data);
          return data;
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem('token');
  //     // console.log(token);
  //     if(!token)
  //     {
  //       setIsLoggedIn(false);
  //       return;
  //     }
  //     try {
  //       const data = await Api.getProfile(token);
  //       if (data.status) {
  //         setUser(data.data);
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const authValue = {
    validateUser,
    handleLoginSuccess,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path="/" element={<PrivateRoute ><Upload_section /></PrivateRoute>} />
              <Route path="/Uploaded_images" element={<Uploaded_images />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/register" element={<Register />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
            <ProfileHeader />
          </header>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

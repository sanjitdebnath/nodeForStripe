import React, { useEffect, useState } from 'react';
// import Api from '../../services/Api';


const ProfileHeader = () => {

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await Api.getProfile(token);
        console.log(data);
        if (data.status) {
          setUser(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUser();
  }, []);

  return (
      <div>
        {
            user ? (<> <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p> </>) : "No user found out"
        }
    </div>
  );

};

export default ProfileHeader;

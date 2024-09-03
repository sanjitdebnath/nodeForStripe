import React, {useState, useEffect,useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Ensure the import path is correct

const PrivateRoute = ({ children}) => {
  let {validateUser} = useContext(AuthContext);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        let res = await validateUser();
        console.log(res);

        if(res.status)
        {
          setAuthenticated(true);
          setUser(res.data);
        }
      } catch (error) {
        console.error('Error validating user:', error);
      }
    };

    checkUser();
  }, [validateUser]);

  console.log(authenticated);

  return authenticated 
    ? React.cloneElement(children, { user }) 
    : <Navigate to="/login" />;
};

export default PrivateRoute;

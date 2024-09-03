import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLogin = ({ onLoginSuccess,user }) => {
    const navigate = useNavigate();
    const [Login, setLogin] = useState({
        username: '',
        password: ''
    });


    const handleChange = (e) => {
        setLogin({
            ...Login,
            [e.target.name]: e.target.value
        });
        console.log(Login);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      };

    const handleSubmit = async () => {
        let filed = '';
        Object.keys(Login).forEach(async (key, index, array) => {
            if (!Login[key]) {
                filed += key;
                if (index < array.length - 1) {
                    filed += ',';
                }
            }
        });

        if (filed) {
            toast.error(filed+" is required.", {
                position: "top-right",
                autoClose: 1500,
            });
            return;
        }
       
        try {
            const response = await axios.post('http://localhost:5001/api/login', Login);
            if(response.data.status)
            {
                onLoginSuccess(response.data.token)
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 1500,
                });
                navigate('/');
            }else{
                toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 1500,
                });
            }
        } catch (error) {
            toast.error('Login failed.', {
                position: "top-right",
                autoClose: 1500,
            });
        }
    };

    return <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-5">
        <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white mb-8">Login</h1>
        <div className="relative">
            <input type="text" id="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " 
            name='username'
            value={Login.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            />
            <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Username</label>
        </div>
        <div className="relative mt-5">
            <input type="password" id="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " 
            name='password'
            value={Login.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            />
            <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
        </div>
        <div className='flex flex-col justify-end'>
            <button type="submit" className="text-white mt-8 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleSubmit}>Login</button>
            <small className="text-black text-sm w-full" >Don't have an account?  <Link to="/register" className='colors.blue'>Register</Link></small>
        </div>

    </div>
}

export default UserLogin;

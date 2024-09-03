import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoTrashBin } from 'react-icons/io5';
import '../component-style/Upload_images.css';
import { toast, ToastContainer } from 'react-toastify';
import {useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../services/Api';




const Upload_images = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      Redirect_url();
      const response = await axios.get('http://localhost:5001/api/get_AllMedia');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  const Redirect_url = async ()=>
  {
      const count = await Api.getCount();
      if(count < 1)
      {
        navigate('/');
      }
  }

  const delete_image = async (val) => {
    try {
      const response = await axios.post('http://localhost:5001/api/delete_single_data', val, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.data.status == "success")
      {
        fetchData();
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        Redirect_url();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-10">
      {data.map((res, index) => (
        <div key={index} className="image-container">
          <img className="h-48 w-100 rounded-xl image" src={`http://localhost:5001/uploads/${res.filename}`} alt={`Gallery image ${index + 1}`} />
          <IoTrashBin className="delete-icon" onClick={() => delete_image({id : res.id, filename : res.filename})} />
        </div>
      ))}
    </div>
  );
};

export default Upload_images;

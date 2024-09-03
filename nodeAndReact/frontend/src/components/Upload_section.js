import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import '../component-style/Upload_section.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Api from '../services/Api';


function Upload_section() {

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [showButton, setShowButton] = useState(false);



  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.success("Please select a file first!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        fetchCount();
        fileInputRef.current.value = null;
      }

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  const handleFileChange = (event) => {
    // console.log(event.target.files[0])
    setFile(event.target.files[0]);
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Uploaded_images'); // Navigate to the "/about" route
  };

  const fetchCount = async () => {
    try {
      const count = await Api.getCount();
      setShowButton(count >= 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    fetchCount();
  }, []);

  return (
    <div>
      <form onSubmit={handleFileUpload} className="max-w-sm mx-auto">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
          <input onChange={handleFileChange} ref={fileInputRef} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input>
          <button type="submit" className="text-white mt-8 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Upload</button>
        </div>
      </form>
      
      {showButton && (
                <button
                    onClick={handleButtonClick}
                    type="button"
                    className="text-white mt-8 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                    View Uploaded Images
                </button>
            )}
    </div>
  );
}

export default Upload_section;

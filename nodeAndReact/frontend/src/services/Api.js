import axios from 'axios';

const Api = {
  getCount: async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/get_Media_count');
      return response.data.data.count;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  getProfile: async (token) => {
    const api = axios.create({
      baseURL: 'http://localhost:5001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    api.interceptors.request.use(config => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    }, error => {
      console.error('Request error:', error);
      return Promise.reject(error);
    });

    api.interceptors.response.use(response => {
      return response;
    }, error => {
      return Promise.reject(error);
    });

    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error;
    }
  }
};

export default Api;

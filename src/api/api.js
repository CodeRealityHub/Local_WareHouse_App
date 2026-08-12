import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL:  "http://10.0.2.2:6000/api", // Replace with your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },  
    timeout: 5000, // Set a timeout for requests (optional)
});

api.interceptors.request.use(
    async (config) => {
        // You can add authorization headers or other custom headers here if needed
        const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
   async (response) => {
        return response;
    },
    async (error) => {
        // Handle errors globally, e.g., show a notification or log the error
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);  

export default api;
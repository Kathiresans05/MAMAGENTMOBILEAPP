import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:5000/api', // Local Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

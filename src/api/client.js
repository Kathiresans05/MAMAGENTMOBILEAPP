import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:5000/api', // For Android Emulator to access local server
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

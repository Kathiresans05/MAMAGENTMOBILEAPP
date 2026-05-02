import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://agentmobileapp.onrender.com/api', // Render Production Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

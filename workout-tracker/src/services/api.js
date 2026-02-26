import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getExercises = async (page = 1, pageSize = 25) => {
    const offset = (page - 1) * pageSize;
    const response = await API.get(`exerciseinfo/?limit=${pageSize}&offset=${offset}`);
    return response.data.results;
};

export const getExerciseVideos = async (exerciseId) => {
    const response = await API.get(`exerciseinfo/${exerciseId}/`);
    return response.data.results;
};
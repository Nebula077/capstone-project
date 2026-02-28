import axios from 'axios';
import supabase from '../../supabase-client';

const API = axios.create({
    baseURL: import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// External API (wger.de) queries
export const getExercises = async (page = 1, pageSize = 25) => {
    const offset = (page - 1) * pageSize;
    const response = await API.get(`exerciseinfo/?limit=${pageSize}&offset=${offset}`);
    return response.data;
};

export const getExerciseById = async (exerciseId) => {
    const response = await API.get(`exerciseinfo/${exerciseId}/`);
    return response.data;
};

export const getExerciseVideos = async (exerciseId) => {
    const response = await API.get(`exerciseinfo/${exerciseId}/`);
    return response.data.results;
};

export const getExerciseCategories = async () => {
    const response = await API.get('exercisecategory/');
    return response.data.results;
};

// Supabase queries
export const fetchScheduledExercises = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false);       
    if (error) throw error;
    return data || [];
};

export const fetchSavedExercises = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data || [];
};

export const fetchCompletedExercises = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    const { data, error } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

// Mutations
export const completeScheduledExercise = async ({ userId, exerciseId }) => {
    const { error } = await supabase
        .from('user_exercises')
        .update({
            completed: true,
            completed_at: new Date().toISOString(),
        })
        .eq('id', exerciseId)
        .eq('user_id', userId);
    if (error) throw error;
};

export const completeSavedExercise = async ({ userId, exerciseId }) => {
    const { error } = await supabase
        .from('exercises')
        .update({ 
            completed: true, 
            completed_at: new Date().toISOString() 
        })
        .eq('id', exerciseId)
        .eq('user_id', userId);
    if (error) throw error;
};
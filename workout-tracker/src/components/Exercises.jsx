import React from 'react'
import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer.jsx';

function Exercises() {

    const [exercises, setExercises] = useState([]);
    const { user } = useAuth();
    const BASE_URL = import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/';
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const getVideos = async (exerciseId) => {
        try {
            const response = await axios.get(`${BASE_URL}exerciseinfo/${exerciseId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    };
 

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`${BASE_URL}exerciseinfo/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setExercises(response.data.results);
                setLoading(false);
                // console.log(response.data.results);
                
            } catch (error) {
                console.error('Error fetching exercises:', error);
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}exercisecategory/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setCategories(response.data.results);
            console.log(response.data.results);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    

    if (loading) {
        return <p>Loading...</p>;
    }

  return (
    <div>
      <NavBar />
        <h1 className='text-2xl font-bold mb-4'>Exercise Library</h1>
        <p className='text-gray-700'>Browse through a wide range of exercises and find the perfect workout for your goals.</p>
        <div className='mt-6 p-4 bg-white rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-2'>All Exercises</h2>
            {exercises.map((exercise) => {
                const englishName = exercise.translations.find((t) => t.language === 2)?.name || exercise.name;
                return (
                <div key={exercise.id} className='p-4 bg-gray-100 rounded-lg shadow-sm mb-4'>
                    <h3 className='text-lg font-semibold'>{englishName?englishName : exercise.name}</h3>
                    <h5>Muscles: {exercise.muscles?.length > 0 ? exercise.muscles.map((muscle) => muscle.name_en).join(', ') : 'N/A'} </h5>
                    <h5>Category: {exercise.category?.name || 'N/A'}</h5>
                    <h5>Equipment: {exercise.equipment?.name || 'N/A'}</h5>
                    {exercise.images?.length > 0 && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 object-cover lg:grid-cols-4 lg:gap-6 sm:gap-4 xs:grid-cols-1">
                            {exercise.images.map((image) => (
                                <img key={image.id} src={image.image} alt={englishName} className="w-full h-48 object-cover rounded-md mb-2" />
                            ))}
                        </div>
                    )}
                    <p className='text-gray-700'>Description: {exercise.description}</p>
                    <p>Videos: {exercise.videos?.length || 0}</p>
                </div>
                );
            })}
            {categories.map((category) => (
                <div key={category.id} className='p-4 bg-gray-100 rounded-lg shadow-sm mb-4'>
                    <h3 className='text-lg font-semibold'>{category.name}</h3>
                </div>
            ))}
        </div>
        <div>
            <button onClick={getCategories} className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Get Categories</button>
        </div>
        <Footer />
    </div>
  )
}

export default Exercises
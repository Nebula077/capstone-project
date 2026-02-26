import React from 'react'
import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer.jsx';
import { useLocation } from 'react-router-dom';
import { saveUserExercise } from '../utils/saveUserExercise';
import LoadingSkeleton from '../context/LoadingSkeleton.jsx';

function Exercises() {

    const [exercises, setExercises] = useState([]);
    const { user } = useAuth();
    const BASE_URL = import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/';
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const PAGE_SIZE = 25;

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

    const [selectedExercises, setSelectedExercises] = useState([]);
    const handleExerciseSelect = (exercise) => {
        if (selectedExercises.includes(exercise)) {
            setSelectedExercises(selectedExercises.filter((e) => e !== exercise));
        } else {
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    const handleAddExercise = async (exercise) => {
        const result = await saveUserExercise(user, exercise);

        if (!result.ok) {
            if (result.error === 'NOT_AUTHENTICATED') {
                alert('Please log in to save exercises.');
            } else if (result.error === 'ALREADY_EXISTS') {
                alert('This exercise is already saved.');
            } else {
                console.error('Error saving exercise:', result.error);
                alert('Could not save exercise. Please try again.');
            }
            return;
        }

        alert('Exercise saved!');
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const offset = (page - 1) * PAGE_SIZE;

                const response = await axios.get(
                    `${BASE_URL}exerciseinfo/?limit=${PAGE_SIZE}&offset=${offset}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setExercises(response.data.results);
                setHasNext(!!response.data.next);
                setHasPrev(!!response.data.previous);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [BASE_URL, page]);

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
    

    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [source, setSource] = useState("wger");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('query') || '';
        const src = params.get('source') || 'wger';

        setSearchQuery(q);
        setSource(src === 'saved' ? 'saved' : 'wger');
    }, [location.search]);

    const [term, setTerm] = useState('');        

    if (loading) {
        return (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 p-6'>
                {Array.from({ length: 10 }).map((_, index) => <LoadingSkeleton key={index} />)}
            </div>
    );
    }

  return (
    <div>
      <NavBar />
        <h1 className='text-2xl font-bold mb-4'>Exercise Library</h1>
        <p className='text-gray-700'>Browse through a wide range of exercises and find the perfect workout for your goals.</p>
        <div className='mt-6 p-4 bg-white rounded-2xl shadow-md'>
            <h2 className='text-xl font-semibold mb-2'>All Exercises</h2>
            {exercises.map((exercise) => {
                const englishName = exercise.translations.find((t) => t.language === 2)?.name || exercise.name;
                return (
                <div key={exercise.id} className='flex'>
                    <div className='p-4 bg-slate-100 rounded-lg shadow-sm mb-4 w-100 flex-4 border-l-4 border-blue-500'>
                        <h3 className='text-lg font-semibold'>{englishName?englishName : exercise.name}</h3>
                        <h5>Muscles: {exercise.muscles?.length > 0 ? exercise.muscles.map((muscle) => muscle.name_en).join(', ') : 'N/A'} </h5>
                        <h5>Category: {exercise.category?.name || 'N/A'}</h5>
                        <h5>Equipment: {exercise.equipment?.name || 'N/A'}</h5>
                        {exercise.images?.length > 0 && (
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 object-cover lg:grid-cols-4 lg:gap-6 sm:gap-4 xs:grid-cols-1">
                                {exercise.images.map((image) => {
                                    const imageUrl = image.image.replace('http://', 'https://');
                                    return <img key={image.id} src={imageUrl} alt={englishName} className="w-full h-48 object-cover rounded-md mb-2" />;
                                })}
                            </div>
                        )}
                        <p className='text-gray-700'>Description: {exercise.description}</p>
                        <p>Videos: {exercise.videos?.length || 0}</p>
                    </div>
                    <div className='ml-4 w-20 flex-1 mt-3'>
                        <div className='mt-2'>
                            <input type="checkbox" className='mx-auto ' id={`selectExercise-${exercise.id}`} onChange={() => handleExerciseSelect(exercise)} />
                        </div>
                        <div>
                            <button id='selectExeBtn' onClick={() => handleAddExercise(exercise)} className='mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>Add</button>
                        </div>
                        
                    </div>
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
        <div className="flex items-center justify-between mb-4">
            <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev || loading}
            >
                Previous
            </button>
            <span>Page {page}</span>
            <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext || loading}
            >
                Next
            </button>
        </div>
        <Footer />
    </div>
  )
}

export default Exercises
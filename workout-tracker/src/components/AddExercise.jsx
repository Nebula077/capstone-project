import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from './Footer.jsx';
import { Formik } from 'formik';
import supabase from '../../supabase-client';
import { useNavigate } from 'react-router-dom';

function AddExercise() {

const { user } = useAuth();
const BASE_URL = import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/';
const navigate = useNavigate();



  return (
    <div>
      <NavBar />
      <h1>Add Exercise</h1>
      <div>
        <div>
            <Formik
                initialValues={{ name: '', description: '', category: '' }}
                onSubmit={async (values, { setSubmitting, resetForm }) => { 
                    try {
                        if (!user) {
                            alert('You must be logged in to add an exercise.');
                            return;
                        }

                        const { error } = await supabase
                            .from('exercises')
                            .insert({
                                user_id: user.id,
                                name: values.name,
                                description: values.description,
                                category: values.category,
                            });

                        if (error) {
                            console.error('Error saving exercise:', error);
                            alert('Failed to save exercise. Please try again.');
                        } else {
                            alert('Exercise saved!');
                            resetForm();
                        }
                    } catch (err) {
                        console.error('Unexpected error saving exercise:', err);
                        alert('Unexpected error. Please try again.');
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto'>
                        <div className="mb-4">
                        <label htmlFor="name" className='block text-grey-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name:</label>
                        <input type="text" id="name" name="name" value={values.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="description" className='block text-grey-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Description:</label>
                        <input type="text" id="description" name="description" value={values.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="category" className='block text-grey-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Category:</label>
                        <input type="text" id="category" name="category" value={values.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div className='flex mx-auto gap-4 justify-center'>
                                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' >Submit</button>
                        </div>
                    </form>
                )}
            </Formik>
            <div>
                <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded p-1 mx-auto mb-2' onClick={() => navigate('/exercises')}>Add From Exercises</button>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AddExercise
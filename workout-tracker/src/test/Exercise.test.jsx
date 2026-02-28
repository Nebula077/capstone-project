import {render, screen } from '@testing-library/react';
import Exercises from '../components/Exercises';

test ('renders exercise details correctly', () => {
    
    render(<Exercises  />); 
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Description of the exercise')).toBeInTheDocument();
});
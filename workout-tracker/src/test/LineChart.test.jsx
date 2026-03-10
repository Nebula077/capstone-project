import { render, screen } from '@testing-library/react';
import LineChart from '../components/LineChart.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('LineChart component', () => {
  it('shows message when there is no activity data', () => {
    render(
      <AuthProvider>
        <LineChart activities={[]} />
      </AuthProvider>
    );
    expect(screen.getByText(/no activity data for chart/i)).toBeInTheDocument();
  });

  it('renders a canvas element when data is provided', () => {
    const activities = [
      { completed_at: '2025-01-01T12:00:00Z', duration: '30' },
      { completed_at: '2025-01-01T13:00:00Z', duration: '20' },
      { completed_at: '2025-01-02T09:00:00Z', duration: '45' },
    ];
    render(
      <AuthProvider>
        <LineChart activities={activities} />
      </AuthProvider>
    );
    // Chart.js renders a canvas which has role="img" by default
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
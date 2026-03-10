import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchCompletedExercises } from '../services/api.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ activities }) {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(null);
  const [chartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false, // allow custom container height
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Exercise Activity' },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Minutes' },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Exercises' },
        grid: { drawOnChartArea: false },
      },
    },
  });

  useEffect(() => {
    // we can either use passed activities or fetch ourselves
    const load = async () => {
      let data = activities;
      if (!data && user) {
        try {
          data = await fetchCompletedExercises(user.id);
        } catch (err) {
          console.error('Error loading chart activities', err);
          data = [];
        }
      }

      if (!data || data.length === 0) {
        setChartData(null);
        return;
      }

      // aggregate by date (YYYY-MM-DD)
      const agg = {};
      data.forEach((ex) => {
        const dateStr = ex.completed_at
          ? new Date(ex.completed_at).toISOString().split('T')[0]
          : 'unknown';
        if (!agg[dateStr]) agg[dateStr] = { totalMinutes: 0, count: 0 };
        agg[dateStr].totalMinutes += parseInt(ex.duration) || 0;
        agg[dateStr].count += 1;
      });

      const labels = Object.keys(agg).sort();
      const minutes = labels.map((l) => agg[l].totalMinutes);
      const counts = labels.map((l) => agg[l].count);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Minutes',
            data: minutes,
            borderColor: 'rgb(75,192,192)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            yAxisID: 'y1',
          },
          {
            label: 'Exercises Completed',
            data: counts,
            borderColor: 'rgb(153,102,255)',
            backgroundColor: 'rgba(153,102,255,0.2)',
            yAxisID: 'y2',
          },
        ],
      });
    };

    load();
  }, [activities, user]);

  if (!chartData) {
    return <p className="text-center text-gray-600">No activity data for chart.</p>;
  }

  // fixed-height responsive wrapper
  return (
    <div className="w-full h-64 sm:h-80 lg:h-96">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default LineChart;
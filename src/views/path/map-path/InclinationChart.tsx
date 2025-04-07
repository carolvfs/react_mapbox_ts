import React from 'react';
import { Line } from 'react-chartjs-2';
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


// Register the necessary chart components.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface InclinationChartProps {
  inclinations: number[];
}

const InclinationChart: React.FC<InclinationChartProps> = ({ inclinations }) => {
  const chartData = {
    labels: inclinations.map((_, index) => `Point ${index + 1}`),
    datasets: [
      {
        label: 'Terrain Inclination (%)',
        data: inclinations,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: false,
          // display: true,
          text: 'Route Point',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Inclination (%)',
        },
      },
    },
  };

  return (
    // <div style={{ position:"absolute", top:0, left: 0, width: '100vw', height: '250px', margin: '20px auto', zIndex:1000}}>
    <div style={{ position:"absolute", top:0, left: 0, width: '50%', height: '250px', margin: '20px auto', zIndex:1000}}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default InclinationChart;

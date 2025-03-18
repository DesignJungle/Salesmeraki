'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export function RevenueChart({ data }: { data: SalesData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Revenue Trend' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
}

export function SalesBarChart({ data }: { data: SalesData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Sales by Category' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  );
}
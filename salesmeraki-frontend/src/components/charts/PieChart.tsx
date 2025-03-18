'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  height?: number;
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value})`;
          }
        }
      }
    },
  };

  // Ensure datasets have colors if not provided
  const enhancedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || getDefaultColors(dataset.data.length),
      borderColor: dataset.borderColor || getDefaultColors(dataset.data.length, true),
      borderWidth: dataset.borderWidth || 1,
    })),
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie options={options} data={enhancedData} />
    </div>
  );
}

// Helper function to generate default colors
function getDefaultColors(count: number, isBorder: boolean = false): string[] {
  const colors = [
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(201, 203, 207, 0.6)',
    'rgba(255, 205, 86, 0.6)',
  ];
  
  const borderColors = colors.map(color => color.replace('0.6', '1'));
  
  return Array(count).fill(0).map((_, i) => 
    isBorder ? borderColors[i % borderColors.length] : colors[i % colors.length]
  );
}
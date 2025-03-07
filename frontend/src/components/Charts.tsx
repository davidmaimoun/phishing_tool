import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export interface MyChartData {
    labels: string[] | undefined;
    values: any;
    legend?: string;
    colors?: string | string[];
}

export interface MyChartProps {
    data: MyChartData;
    isHorizontal?: boolean;
}

// Line Chart Component
export const LineChart: React.FC<MyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.legend,
        data: data.values,
        backgroundColor: data.colors ? data.colors : "rgba(0, 0, 255, 0.1)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} />;
};

export const BarChart: React.FC<MyChartProps> = ({ data, isHorizontal=false }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.legend,
        data: data.values,
        backgroundColor: data.colors ? data.colors : "rgba(0, 0, 255, 0.1)",
      },
    ],
  };

  const options = {
    indexAxis: isHorizontal ? "y" as const : "x" as const,// ✅ This makes the bar chart horizontal
  };

  return <Bar data={chartData} options={options} />;
};



export const StackedPercentBarChart: React.FC<MyChartProps> = ({ data }) => {
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: data.legend,
          data: data.values,
          backgroundColor: data.colors ? data.colors : "rgba(0, 0, 255, 0.1)",
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              let total = tooltipItem.dataset.data.reduce((sum: number, value: number) => sum + value, 0);
              let percentage = ((tooltipItem.raw / total) * 100).toFixed(2) + "%";
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw} (${percentage})`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          min: 0,
          max: 100, // Convert values to percentage
          ticks: {
            callback: (value: any) => `${value}%`,
          },
        },
      },
    };
  
    return <Bar data={chartData} options={options} />;
  };

export const DoughnutChart: React.FC<MyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.legend,
        data: data.values,
        backgroundColor: data.colors ? data.colors : ["blue", "red", "green"],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default { LineChart, BarChart, DoughnutChart };

import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const HorizontalBarChart = () => {
  const barData = {
    labels: ["Phished", "Submitted"],  // X-axis values (label for bars)
    datasets: [
      {
        label: "Phished",  // Label for the first bar
        data: [30],  // Data for the "Phished" bar
        backgroundColor: "rgba(75, 192, 192, 0.5)",  // Color for "Phished"
      },
      {
        label: "Submitted",  // Label for the second bar
        data: [70],  // Data for the "Submitted" bar
        backgroundColor: "rgba(153, 102, 255, 0.5)",  // Color for "Submitted"
      },
    ],
  };

  const options = {
    indexAxis: "y", // This makes the chart horizontal (by default it is vertical)
    responsive: true,
    plugins: {
      legend: {
        position: "top",  // Position of the legend (you can change it)
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem:any) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Horizontal Bar Chart</h2>
      <Chart type="bar" data={barData} options={options} />
    </div>
  );
};

export default HorizontalBarChart;

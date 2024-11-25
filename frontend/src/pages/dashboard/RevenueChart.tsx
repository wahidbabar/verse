import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  // Sample revenue data for each month
  const revenueData = [
    500, 700, 800, 600, 750, 900, 650, 870, 960, 1020, 1100, 1150,
  ];

  // Chart data and configuration
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue (USD)",
        data: revenueData,
        backgroundColor: "rgba(34, 197, 94, 0.7)", // Green shade
        borderColor: "rgba(34, 197, 94, 1)", // Darker green border
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Explicitly set to a valid literal type
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis from 0
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Monthly Revenue
      </h2>
      <div className="hidden md:block">
        {/* Render the Bar chart */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;

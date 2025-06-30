import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { faShoppingCart, faTruck, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import MetricCard from "../components/MeticCard";
import "../index.css";
import RecentOrdersTable from "../components/RecentOrdersTable"; // Make sure this accepts dummy props or is internally populated

const DashboardPage = () => {
  const dishPopularityChartRef = useRef(null);
  const revenueTrendChartRef = useRef(null);

  const dummyOrdersToday = 8;
  const dummyPendingDeliveries = 3;
  const dummyWeeklyRevenue = "$1,420";

  useEffect(() => {
    const dishPopularityChartNode = dishPopularityChartRef.current;
    const revenueTrendChartNode = revenueTrendChartRef.current;

    // Pie Chart – Top Dishes
    if (dishPopularityChartNode) {
      const ctx = dishPopularityChartNode.getContext("2d");
      if (dishPopularityChartNode.chart) {
        dishPopularityChartNode.chart.destroy();
      }
      dishPopularityChartNode.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Paneer Tikka Thali", "Veg Biryani", "Chapati Combo", "Dal Makhani", "Chicken Curry"],
          datasets: [
            {
              label: "Orders",
              data: [120, 90, 75, 60, 50],
              backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"],
              borderColor: "#fff",
              borderWidth: 2,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter", size: 13, weight: "500" },
                color: "#475569",
              },
            },
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleFont: { family: "Inter", size: 14, weight: "600" },
              bodyFont: { family: "Inter", size: 13 },
              padding: 10,
              cornerRadius: 8,
            },
          },
        },
      });
    }

    // Bar Chart – Weekly Revenue
    if (revenueTrendChartNode) {
      const ctx = revenueTrendChartNode.getContext("2d");
      if (revenueTrendChartNode.chart) {
        revenueTrendChartNode.chart.destroy();
      }
      revenueTrendChartNode.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Revenue ($)",
              data: [180, 220, 190, 250, 200, 280, 300],
              backgroundColor: "#34D399",
              borderColor: "#059669",
              borderWidth: 1,
              borderRadius: 6,
              hoverBackgroundColor: "#10B981",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleFont: { family: "Inter", size: 14, weight: "600" },
              bodyFont: { family: "Inter", size: 13 },
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { family: "Inter", size: 12 },
                color: "#64748b",
              },
              grid: {
                color: "#e2e8f0",
              },
            },
            x: {
              ticks: {
                font: { family: "Inter", size: 12 },
                color: "#64748b",
              },
            },
          },
        },
      });
    }

    return () => {
      if (dishPopularityChartNode?.chart) dishPopularityChartNode.chart.destroy();
      if (revenueTrendChartNode?.chart) revenueTrendChartNode.chart.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Back, Chef!</h1>
          <p className="text-gray-600">Here’s your dashboard for insights and performance tracking.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <MetricCard icon={faShoppingCart} bgColor="bg-green-100" textColor="text-green-700" title="Today's Orders" value={dummyOrdersToday} />
          <MetricCard icon={faTruck} bgColor="bg-yellow-100" textColor="text-yellow-600" title="Pending Deliveries" value={dummyPendingDeliveries} />
          <MetricCard icon={faDollarSign} bgColor="bg-blue-100" textColor="text-blue-600" title="Weekly Revenue" value={dummyWeeklyRevenue} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Most Ordered Dishes</h2>
            <div className="h-80">
              <canvas ref={dishPopularityChartRef}></canvas>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Revenue Trend</h2>
            <div className="h-80">
              <canvas ref={revenueTrendChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <RecentOrdersTable />
      </main>
    </div>
  );
};

export default DashboardPage;

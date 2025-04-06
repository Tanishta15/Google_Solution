// Dashboard.jsx
import React from "react";
import LiveScanPanel from "./LiveScanPanel";
import ViolationSummary from "./ViolationSummary";
import NotificationBox from "./NotificationBox";
import DetectedContent from "./DetectedContent";
import ViolationTable from "./ViolationTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const data = [
  {
    platform: "YouTube",
    violations: 400,
    fill: "#8884d8",
  },
  {
    platform: "Netflix",
    violations: 300,
    fill: "#ff4d4f",
  },
  {
    platform: "Instagram",
    violations: 200,
    fill: "#52c41a",
  },
  {
    platform: "Facebook",
    violations: 100,
    fill: "#1890ff",
  },
];

const BarChartComponent = () => (
  <div className="bg-white p-4 shadow rounded h-[280px]">
    <h2 className="text-lg font-semibold mb-2">Top Platforms With Violations</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="platform" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="violations">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Real-Time Monitoring Panel</h1>
      </div>

      {/* Grid Layout Like Wireframe */}
      <div className="grid grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="bg-white p-4 shadow rounded h-[220px]">
          <LiveScanPanel />
        </div>
        <div className="bg-white p-4 shadow rounded h-[220px]">
          <ViolationSummary />
        </div>

        {/* Row 2 */}
        <div className="bg-white p-4 shadow rounded h-[220px]">
          <DetectedContent />
        </div>
        <div className="bg-white p-4 shadow rounded h-[220px]">
          <ViolationTable />
        </div>

        {/* Row 3 */}
        <div className="bg-white p-4 shadow rounded h-[200px]">
          <NotificationBox />
        </div>
        <BarChartComponent />
      </div>
    </div>
  );
};

export default Dashboard;

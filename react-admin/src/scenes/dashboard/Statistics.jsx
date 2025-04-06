import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: "YouTube", value: 40 },
  { name: "Netflix", value: 30 },
  { name: "Instagram", value: 20 },
  { name: "TikTok", value: 10 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57"];

const barData = [
  { platform: "YT", violations: 12 },
  { platform: "Netflix", violations: 9 },
  { platform: "Insta", violations: 6 },
  { platform: "TikTok", violations: 4 },
];

const Statistics = () => {
  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Top Platforms With Violations
      </Typography>
      <Box height={150}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={50}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box height={200}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="violations" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Statistics;

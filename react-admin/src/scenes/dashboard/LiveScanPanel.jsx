import { Box, Typography, LinearProgress } from "@mui/material";

const LiveScanPanel = () => {
  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Live Scanning Status
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Scanning Content: 1,452 / 10,000
      </Typography>
      <LinearProgress variant="determinate" value={(1452 / 10000) * 100} sx={{ mt: 1 }} />
    </Box>
  );
};

export default LiveScanPanel;
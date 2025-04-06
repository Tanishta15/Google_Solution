import { Box, Typography, List, ListItem, ListItemText, LinearProgress } from "@mui/material";

const DetectedContent = () => {
  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Detected Content
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Unauthorized Used Content: 1,452 / 10,000
      </Typography>
      <LinearProgress variant="determinate" value={(1452 / 10000) * 100} sx={{ mt: 1, mb: 2 }} />
      <List>
        <ListItem><ListItemText primary="Unlicensed clip from show XYZ" /></ListItem>
        <ListItem><ListItemText primary="Duplicated scene on TikTok" /></ListItem>
      </List>
    </Box>
  );
};

export default DetectedContent;
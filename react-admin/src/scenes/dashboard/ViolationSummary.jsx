import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ViolationSummary = () => {
  const items = ["Unauthorized upload on YouTube", "Copyright audio on Instagram", "Duplicate video detected", "Flagged series on Netflix"];

  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Violation Alert System Summary
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon><ErrorOutlineIcon color="error" /></ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ViolationSummary;
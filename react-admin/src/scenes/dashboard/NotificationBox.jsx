import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const NotificationBox = () => {
  const data = [
    { severity: "High", preview: "Content Flagged For Copyright Infringement On YouTube." },
    { severity: "Medium", preview: "Plagiarised Content Detected On Netflix." },
  ];

  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Notification
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Severity</TableCell>
            <TableCell>Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.severity}</TableCell>
              <TableCell>{item.preview}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default NotificationBox;
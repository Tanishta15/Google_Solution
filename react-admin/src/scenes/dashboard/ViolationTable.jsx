import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const ViolationTable = () => {
  const rows = [
    { id: 1, platform: "YouTube", type: "Video", violation: "Unlicensed Usage", status: "Pending" },
    { id: 2, platform: "Netflix", type: "Video", violation: "Plagiarism", status: "Resolved" },
  ];

  return (
    <Box bgcolor="#1F2A40" p={2} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Violation Table
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Platform</TableCell>
            <TableCell>Content Type</TableCell>
            <TableCell>Violation Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.platform}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.violation}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ViolationTable;
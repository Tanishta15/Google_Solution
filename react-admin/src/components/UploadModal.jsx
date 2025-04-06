import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUpload from "./FileUpload";

const UploadModal = ({ open, onClose }) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === "dark" ? "#1F2A40" : "#f5f5f5";
  const headerColor = theme.palette.mode === "dark" ? "#3e4396" : "#1976d2";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 12,
          backgroundColor: backgroundColor,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: headerColor,
          color: "white",
          p: 2,
          m: 0,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h5" fontWeight="600" component="div">
              Document Analysis
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;

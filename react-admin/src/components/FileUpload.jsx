import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  LinearProgress,
  useTheme,
  Card,
  CardContent,
  Fade,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const FileUpload = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
    setError(null);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  // Simulating progress for better UX
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const increment = Math.random() * 10;
        const newProgress = Math.min(prevProgress + increment, 90);
        return newProgress;
      });
    }, 500);

    return interval;
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    // Start progress simulation
    const progressInterval = simulateProgress();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      // Complete progress
      setUploadProgress(100);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  // Helper function to get the sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return (
          <SentimentSatisfiedAltIcon
            fontSize="large"
            sx={{ color: "#4CAF50" }}
          />
        );
      case "negative":
        return (
          <SentimentVeryDissatisfiedIcon
            fontSize="large"
            sx={{ color: "#F44336" }}
          />
        );
      default:
        return (
          <SentimentNeutralIcon fontSize="large" sx={{ color: "#9E9E9E" }} />
        );
    }
  };

  // Helper function to get the sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "#4CAF50";
      case "negative":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Upload Section */}
      <Box sx={{ mb: 4 }}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: isDark
              ? "rgba(30, 40, 60, 0.4)"
              : "rgba(255, 255, 255, 0.8)",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: file ? "primary.main" : "grey.400",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: isDark
                ? "0 0 10px rgba(100, 120, 200, 0.2)"
                : "0 0 10px rgba(25, 118, 210, 0.2)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <input
              accept="text/*, .pdf, .doc, .docx"
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />

            {!file ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{
                    fontSize: 60,
                    color: "primary.main",
                    opacity: 0.7,
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  color="textSecondary"
                  align="center"
                  gutterBottom
                >
                  Drag and drop your file here or
                </Typography>

                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    sx={{
                      mt: 1,
                      px: 3,
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Browse Files
                  </Button>
                </label>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Supported formats: PDF, DOC, DOCX, TXT
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ArticleOutlinedIcon
                      sx={{
                        fontSize: 36,
                        color: "primary.main",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="500">
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  </Box>

                  <Tooltip title="Remove file">
                    <IconButton
                      onClick={clearFile}
                      size="small"
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "error.contrastText",
                        },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Button
                  variant="contained"
                  onClick={uploadFile}
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                  startIcon={loading ? undefined : <UploadFileIcon />}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <Typography>Processing...</Typography>
                    </Box>
                  ) : (
                    "Analyze Document"
                  )}
                </Button>

                {loading && (
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        borderRadius: 1,
                        height: 8,
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      {uploadProgress < 100
                        ? "Analyzing document with AI..."
                        : "Analysis complete!"}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {result && result.sentiment_analysis && (
        <Fade in={!!result}>
          <Card
            sx={{
              mt: 3,
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                bgcolor: getSentimentColor(result.sentiment_analysis.sentiment),
                color: "#fff",
              }}
            >
              <Box sx={{ mr: 1 }}>
                {getSentimentIcon(result.sentiment_analysis.sentiment)}
              </Box>
              <Typography variant="h6" fontWeight="600">
                {result.sentiment_analysis.sentiment?.toUpperCase() ||
                  "UNKNOWN"}{" "}
                SENTIMENT DETECTED
              </Typography>
              {result.sentiment_analysis.confidence && (
                <Chip
                  label={`${result.sentiment_analysis.confidence}% Confidence`}
                  color="default"
                  size="small"
                  sx={{
                    ml: "auto",
                    fontWeight: "bold",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "inherit",
                  }}
                />
              )}
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Summary Section */}
                {result.sentiment_analysis.summary && (
                  <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                      Summary
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: isDark
                          ? "rgba(30, 40, 60, 0.4)"
                          : "rgba(0, 0, 0, 0.03)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">
                        {result.sentiment_analysis.summary}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {/* Key Phrases Section */}
                {result.sentiment_analysis.key_phrases &&
                  result.sentiment_analysis.key_phrases.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" color="textPrimary" gutterBottom>
                        Key Phrases
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: isDark
                            ? "rgba(30, 40, 60, 0.4)"
                            : "rgba(0, 0, 0, 0.03)",
                          borderRadius: 2,
                          minHeight: "120px",
                        }}
                      >
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {result.sentiment_analysis.key_phrases
                            .slice(0, 15)
                            .map((phrase, index) => (
                              <Chip
                                key={index}
                                label={phrase}
                                size="small"
                                sx={{
                                  m: 0.5,
                                  backgroundColor: isDark
                                    ? "rgba(80, 120, 200, 0.2)"
                                    : "rgba(25, 118, 210, 0.1)",
                                  border: "1px solid",
                                  borderColor: isDark
                                    ? "rgba(80, 120, 200, 0.3)"
                                    : "rgba(25, 118, 210, 0.3)",
                                }}
                              />
                            ))}
                        </Box>
                        {result.sentiment_analysis.key_phrases.length > 15 && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ mt: 2, display: "block" }}
                          >
                            +{result.sentiment_analysis.key_phrases.length - 15}{" "}
                            more phrases
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  )}

                {/* Emotional Tone Section */}
                {result.sentiment_analysis.emotional_tone && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                      Emotional Tone
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: isDark
                          ? "rgba(30, 40, 60, 0.4)"
                          : "rgba(0, 0, 0, 0.03)",
                        borderRadius: 2,
                        minHeight: "120px",
                      }}
                    >
                      <Typography variant="body1">
                        {result.sentiment_analysis.emotional_tone}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                  Analysis completed for file: {result.filename}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Box>
  );
};

export default FileUpload;

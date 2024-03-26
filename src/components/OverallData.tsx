import React from "react";
import { Box, Typography, Paper } from "@mui/material";

type OverallDataProps = {
  overallData: {
    totalTime: number | null;
    totalDistance: number | null;
  };
};

const formatTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null) return "Not provided";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} hours`;
};

const OverallData: React.FC<OverallDataProps> = ({ overallData }) => {
  const { totalTime, totalDistance } = overallData;

  if (totalTime === null && totalDistance === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h6" color="textSecondary">
          Overall data are not provided.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", margin: "20px", textAlign: "center" }}
    >
      <Typography variant="h5" gutterBottom>
        Overall Activity Data
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Total Time: {totalTime ? formatTime(totalTime) : "Not provided"}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Total Distance: {totalDistance ? `${totalDistance} m` : "Not provided"}
      </Typography>
    </Paper>
  );
};

export default OverallData;

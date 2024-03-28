import React, { useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

// Update the type to expect an array of data objects
type OverallDataProps = {
  overallData: {
    totalTime: number | null;
    totalDistance: number | null;
  }[];
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const goPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(overallData.length - 1, prevIndex + 1)
    );
  };

  const { totalTime, totalDistance } = overallData[currentIndex];

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", margin: "20px", textAlign: "center" }}
    >
      <Typography variant="h5" gutterBottom>
        Overall Activity Data
      </Typography>
      {overallData.length > 1 && (
        <Box mb={2}>
          <Button onClick={goPrevious} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button
            onClick={goNext}
            disabled={currentIndex === overallData.length - 1}
          >
            Next
          </Button>
        </Box>
      )}
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

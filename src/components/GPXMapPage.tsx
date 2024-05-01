import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GPXMap from "./GPXMap";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BackButton } from "./Page/elements/BackButton";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OverallData from "./OverallData";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // Blue color
    },
    background: {
      default: "#f0f0f0", // Light grey background color
    },
  },
});

export type Position = [number, number, number];

const GPXMapPage: React.FC = () => {
  const location = useLocation();
  const [positions, setPositions] = useState<Position[]>([]);
  const [heartRates, setHeartRates] = useState<Position[]>([]);
  const [overalData, setOveralData] = useState({
    totalTime: null,
    totalDistance: null,
  });
  const [loading, setLoading] = useState(true);
  //const { document_id } = useParams();
  const { ids } = location.state as { ids: number[] };
  const [isEditing, setIsEditing] = useState(false);
  const [boldPolylineIndex, setBoldPolylineIndex] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);

    if (ids && ids.length) {
      fetch(`${backendUrl}/trackdata/by-ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ids }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Assuming 'data' is an array of track objects
          const newPositions = data.map((track) =>
            track.trackpoints.map(({ latitude, longitude, altitude }) => [
              latitude,
              longitude,
              altitude,
            ])
          );

          const newHeartRates = data.map((track) => {
            if (
              track?.trackpoints[0]?.heart_rate > -1 &&
              track?.trackpoints[0]?.heart_rate !== null
            ) {
              return track.trackpoints
                .map(({ heart_rate }) => heart_rate)
                .filter((hr) => hr !== undefined);
            }
            return [];
          });

          const newOverallData = data.map((track) => ({
            totalTime: track.total_time,
            totalDistance: track.total_distance,
          }));

          setPositions(newPositions);
          setHeartRates(newHeartRates);
          setOveralData(newOverallData); // Now it's clearer that we're setting an array representing each track's overall data
        })
        .catch((error) => {
          console.error("Error fetching tracks:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [ids, location.state]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <BackButton />
          <Typography
            variant="h4"
            color="primary"
            align="center"
            gutterBottom
            fontWeight={"bold"}
          >
            GPS Activity Manager
          </Typography>
          {loading || positions.length == 0 ? (
            <Box textAlign="center">
              <CircularProgress size={80} thickness={4} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <>
              <OverallData
                overallData={overalData}
                isEditing={isEditing}
                boldPolylineIndex={boldPolylineIndex}
                onIndexChange={setBoldPolylineIndex}
              />
              <GPXMap
                setIsEditing={setIsEditing}
                positions={positions}
                heartRates={heartRates}
                boldPolylineIndex={boldPolylineIndex}
                setBoldPolylineIndex={setBoldPolylineIndex}
              />
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default GPXMapPage;

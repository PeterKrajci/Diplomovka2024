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

  useEffect(() => {
    setLoading(true);

    // if (document_id) {
    //   fetch(`http://localhost:8000/trackdata/${document_id}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setPositions(
    //         data.trackpoints.map(({ latitude, longitude, altitude }) => [
    //           latitude,
    //           longitude,
    //           altitude,
    //         ])
    //       );
    //       if (data?.trackpoints[0]?.heart_rate) {
    //         setHeartRates(data.trackpoints.map(({ heart_rate }) => heart_rate));
    //       }
    //       setOveralData({
    //         totalDistance: data.total_distance,
    //         totalTime: data.total_time,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching document:", error);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // } else {
    if (ids && ids.length) {
      fetch("http://127.0.0.1:8000/trackdata/by-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          console.log("newPositions", newPositions);
          // Map to each track's heart rates; filter out undefined heart rates per point if necessary
          const newHeartRates = data.map((track) =>
            track.trackpoints
              .map(({ heart_rate }) => heart_rate)
              .filter((hr) => hr !== undefined)
          );
          // Accumulate overall data for each track
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
              <OverallData overallData={overalData} />
              <GPXMap positions={positions} heartRates={heartRates} />
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default GPXMapPage;

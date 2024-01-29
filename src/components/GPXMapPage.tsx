import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GPXMap from "./GPXMap";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BackButton } from "./Page/elements/BackButton";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  const [loading, setLoading] = useState(true);
  const { document_id } = useParams();

  useEffect(() => {
    setLoading(true);

    if (document_id) {
      fetch(`http://127.0.0.1:8000/trackdata/${document_id}`)
        .then((response) => response.json())
        .then((data) => {
          setPositions(
            data.trackpoints.map(({ latitude, longitude, altitude }) => [
              latitude,
              longitude,
              altitude,
            ])
          );
          setHeartRates(transformedData.map(([, heart_rate]) => heart_rate));
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [document_id, location.state]);

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
          {loading && positions ? (
            <Box textAlign="center">
              <CircularProgress size={80} thickness={4} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <GPXMap positions={positions} />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default GPXMapPage;

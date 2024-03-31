import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";
import Loader from "./Page/elements/Loader";
import { Box } from "@mui/material";
import { Typography } from "antd";

function isEmpty(array) {
  return Array.isArray(array) && array.length === 0;
}

export const HeartRateChart = ({
  coordinates,
  heartRates,
  clickedSegmentIndex,
  setNewMarker,
}) => {
  const transform = (coordinates, heartRates) => {
    let id = 0;
    return coordinates.map((group, groupIndex) => {
      const currentHeartRates = heartRates[groupIndex];

      if (isEmpty(currentHeartRates)) {
        return [];
      }
      return group.map((coord, coordIndex) => ({
        id: id++,
        heartRate: currentHeartRates ? currentHeartRates[coordIndex] : 0,
        lat: coord.position.lat,
        lon: coord.position.lon,
      }));
    });
  };

  const transformedCoordinates = transform(coordinates, heartRates);

  if (isEmpty(transformedCoordinates[clickedSegmentIndex])) {
    // When there's no data for the current segment
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: 200, backgroundColor: "#ffebee" }}
      >
        <Typography color="#d32f2f" variant="h6">
          No heart rates data provided for this track
        </Typography>
      </Box>
    );
  }

  return transformedCoordinates.length > 0 ? (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <AreaChart
          data={transformedCoordinates[clickedSegmentIndex]}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          onMouseLeave={(map) => {
            setNewMarker([]);
          }}
          onMouseMove={(e) => {
            // Response obj
            const arr = e?.activePayload;

            if (typeof arr !== "undefined") {
              // Params
              const lat = arr[0].payload.lat;
              const lon = arr[0].payload.lon;

              // Record
              setNewMarker([lat, lon]);
            }
          }}
        >
          <defs>
            <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6347" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff6347" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="id" />
          <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="heartRate"
            stroke="#ff6347"
            fillOpacity={1}
            fill="url(#colorHeartRate)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Loader />
  );
};

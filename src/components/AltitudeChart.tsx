// Function to calculate the min and max elevation
const calculateYAxisDomain = (data) => {
  const elevations = data.map((coord) => coord.elevation);
  const maxElevation = Math.ceil(Math.max(...elevations));
  const minElevation = Math.floor(Math.min(...elevations));
  return [minElevation, maxElevation];
};

import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area } from "recharts";
import Loader from "./Page/elements/Loader";

export const AltitudeChart = ({
  coordinates,
  clickedSegmentIndex,
  setNewMarker,
}) => {
  // Ensure there is data to calculate the domain
  const segmentData =
    coordinates &&
    coordinates[clickedSegmentIndex === -1 ? 0 : clickedSegmentIndex];
  const yAxisDomain = segmentData ? calculateYAxisDomain(segmentData) : [0, 1]; // Default domain if no data

  return coordinates ? (
    <div className="recharts">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={800}
          height={200}
          data={segmentData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          onMouseLeave={() => {
            setNewMarker([]);
          }}
          onMouseMove={(e) => {
            const arr = e?.activePayload;
            if (typeof arr !== "undefined") {
              const lat = arr[0].payload.position.lat;
              const lon = arr[0].payload.position.lon;
              setNewMarker([lat, lon]);
            }
          }}
        >
          <XAxis dataKey="name" />
          <YAxis domain={yAxisDomain} />
          <Area
            type="monotone"
            dataKey="elevation"
            dot={false}
            activeDot={true}
            stroke="#1D8A00"
            fill="#CBFFBD"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Loader />
  );
};

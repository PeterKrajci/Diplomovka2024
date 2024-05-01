import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";
import Loader from "./Page/elements/Loader";
import { calculateYAxisDomain } from "../utils/utils";

export const AltitudeChart = ({
  coordinates,
  clickedSegmentIndex,
  setNewMarker,
}) => {
  // Ensure there is data to calculate the domain
  const segmentData =
    coordinates &&
    coordinates[clickedSegmentIndex === -1 ? 0 : clickedSegmentIndex];
  console.log("calculateYAxisDomain", segmentData);
  const yAxisDomain = segmentData ? calculateYAxisDomain(segmentData) : [0, 1]; // Default domain if no data

  return coordinates ? (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <AreaChart
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
          <defs>
            <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#32cd32" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#32cd32" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="id" />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#32cd32"
            fillOpacity={1}
            fill="url(#colorElevation)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Loader />
  );
};

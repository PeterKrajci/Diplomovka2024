import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area } from "recharts";
import Loader from "./Page/elements/Loader";

export const AltitudeChart = ({
  coordinates,
  clickedSegmentIndex,
  setNewMarker,
}) => {
  return coordinates ? (
    <div className="recharts">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={800}
          height={200}
          data={
            coordinates[clickedSegmentIndex == -1 ? 0 : clickedSegmentIndex]
          }
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
              const lat = arr[0].payload.position.lat;
              const lon = arr[0].payload.position.lon;

              // Record
              setNewMarker([lat, lon]);
            }
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="elevation"
            dot={false}
            activeDot={true}
            stroke="#1D8A00"
            fill="#CBFFBD"
            legendType="star"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Loader />
  );
};

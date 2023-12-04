import { Dispatch, FC, SetStateAction } from "react";

import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area } from "recharts";
import { Position } from "../../GPXMapPage";

type Props = {
  track: Position[];
  setNewMarker: Dispatch<SetStateAction<Position[]>>;
};

const ElevationChart: FC<Props> = ({ track, setNewMarker }) => {
  function transformCoordinates(coordinates: number[][][]) {
    let id = 0;
    return coordinates.map((group) => {
      return group.map((coord) => {
        return {
          id: id++,
          elevation: coord[2],
          position: {
            lat: coord[0],
            lon: coord[1],
          },
        };
      });
    });
  }

  return (
    <div>
      {track?.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={800}
            height={200}
            data={transformCoordinates([track])}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
            onMouseLeave={() => setNewMarker([])}
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
      )}
    </div>
  );
};

export default ElevationChart;

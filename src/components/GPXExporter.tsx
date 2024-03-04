import React from "react";

interface TrackPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

interface Track {
  trackpoints: TrackPoint[];
}

interface Props {
  tracks: Track[];
}

const GPXExporter: React.FC<Props> = ({ tracks }) => {
  const exportAllGPX = () => {
    const toGPXString = (track: any) => {
      const gpxHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <gpx xmlns="http://www.topografix.com/GPX/1/1">
        <trk>
          <name>Track</name>
          <trkseg>
      `;
      const gpxFooter = `          </trkseg>
        </trk>
      </gpx>`;

      const trackpointElements = track
        .map((point) => {
          return `<trkpt lat="${point[0]}" lon="${point[1]}">
            <ele>${point[2]}</ele>
          </trkpt>`;
        })
        .join("\n");

      return gpxHeader + trackpointElements + gpxFooter;
    };

    tracks.forEach((track, index) => {
      const gpxString = toGPXString(track);
      const blob = new Blob([gpxString], { type: "text/xml" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `track_${index}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <button onClick={exportAllGPX}>Export All Tracks as GPX</button>
    </div>
  );
};

export default GPXExporter;

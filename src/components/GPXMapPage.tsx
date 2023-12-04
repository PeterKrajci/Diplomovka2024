// GPXMapPage.tsx
import React, { useState } from "react";
import GPXMap from "./GPXMap";
import GPXUploader from "./GPXUploader";
import gpxParser from "gpxparser";
//import LocationControl from "./LocationControl";

export type Position = [number, number, number];

const GPXMapPage: React.FC = () => {
  const [gpxPositions, setGpxPositions] = useState<Position[]>();

  const handleFileSelect = (selectedFile: Blob | undefined) => {
    if (selectedFile) {
      // Read the selected file
      const reader = new FileReader();
      reader.onload = (event) => {
        const gpxString = event?.target?.result as string;
        const gpx = new gpxParser();
        gpx.parse(gpxString);
        const positions: Position[] = gpx.tracks[0].points.map((p) => {
          return [p.lat, p.lon, p.ele];
        });
        setGpxPositions(positions);
      };
      reader.readAsText(selectedFile);
    }
  };
  return (
    <div>
      <h1>GPX Uploader</h1>
      <GPXUploader onFileSelect={handleFileSelect} />
      <h1>GPX Map</h1>
      <GPXMap positions={gpxPositions || []} />
      {/* <LocationControl /> */}
    </div>
  );
};

export default GPXMapPage;

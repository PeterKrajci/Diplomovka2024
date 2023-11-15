// GPXMapPage.tsx
import React, { useState } from "react";
import GPXMap from "./GPXMap";
import GPXUploader from "./GPXUploader";
import gpxParser from "gpxparser";
//import LocationControl from "./LocationControl";

const GPXMapPage: React.FC = () => {
  const [gpxPositions, setGpxPositions] = useState([] as unknown);

  const handleFileSelect = (selectedFile: Blob | undefined) => {
    if (selectedFile) {
      // Read the selected file
      const reader = new FileReader();
      reader.onload = (event) => {
        const gpxString = event?.target?.result as string;
        console.log(gpxString);
        const gpx = new gpxParser();
        gpx.parse(gpxString);
        const positions = gpx.tracks[0].points.map((p) => {
          return [p.lat, p.lon, p.ele];
        });
        console.log("positions", positions);
        setGpxPositions(positions as unknown);
      };
      reader.readAsText(selectedFile);
    }
  };
  return (
    <div>
      <h1>GPX Uploader</h1>
      <GPXUploader onFileSelect={handleFileSelect} />
      <h1>GPX Map</h1>
      <GPXMap positions={gpxPositions} />
      {/* <LocationControl /> */}
    </div>
  );
};

export default GPXMapPage;

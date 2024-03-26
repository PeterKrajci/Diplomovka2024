import React from "react";
import JSZip from "jszip";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";

type TrackPoint = [number, number, number];

type Track = [TrackPoint[]];

interface Props {
  tracks: Track[];
}

const toGPXString = (trackpoints: TrackPoint[]) => {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="YourAppName" version="1.1">
<trk>
  <name>Track</name>
  <trkseg>
`;
  const gpxFooter = `    </trkseg>
</trk>
</gpx>`;

  const trackpointElements = trackpoints
    ?.map((point) => {
      return `      <trkpt lat="${point[0]}" lon="${point[1]}">
      <ele>${point[2]}</ele>
    </trkpt>`;
    })
    .join("\n");
  console.log("trackpointElements", trackpointElements);
  console.log("trackpoints", trackpoints);
  return gpxHeader + trackpointElements + gpxFooter;
};

const GPXExporter: React.FC<Props> = ({ tracks }) => {
  const exportAllGPX = () => {
    const zip = new JSZip();
    console.log("tracks", tracks);

    tracks.forEach((track, index) => {
      console.log("track", track);
      const gpxString = toGPXString(track);
      zip.file(`track_${index}.gpx`, gpxString);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "tracks.zip");
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={exportAllGPX}>
      Export All Tracks as GPX
    </Button>
  );
};

export default GPXExporter;

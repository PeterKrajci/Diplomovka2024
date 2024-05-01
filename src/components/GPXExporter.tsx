import React from "react";
import JSZip from "jszip";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { toGPXString } from "../utils/utils";

type TrackPoint = [number, number, number];

type Track = [TrackPoint[]];

interface Props {
  tracks: Track[];
}

const GPXExporter: React.FC<Props> = ({ tracks }) => {
  const exportAllGPX = () => {
    const zip = new JSZip();

    tracks.forEach((track, index) => {
      console.log("toGPXString", track);
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

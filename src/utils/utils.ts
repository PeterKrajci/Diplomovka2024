export const transformCoordinates = (coordinates: number[][][]) => {
  let id = 0;
  return coordinates.map((group) =>
    group.map((coord) => ({
      id: id++,
      elevation: coord[2],
      position: {
        lat: coord[0],
        lon: coord[1],
      },
    }))
  );
};

export const calculateYAxisDomain = (data) => {
  if (data.length === 0) {
    return [0, 0];
  }

  const elevations = data.map((coord) => coord.elevation);
  const maxElevation = Math.ceil(Math.max(...elevations)) + 10;
  const minElevation = Math.floor(Math.min(...elevations)) - 10;
  return [minElevation, maxElevation];
};

export const formatTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null) return "Not provided";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} hours`;
};

export const toGPXString = (trackpoints) => {
  const gpxHeader =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="YourAppName" version="1.1">\n' +
    "  <trk>\n" +
    "    <name>Track</name>\n" +
    "    <trkseg>";

  const gpxFooter = "</trkseg>\n" + "  </trk>\n" + "</gpx>";

  const trackpointElements = trackpoints
    .map((point) => {
      return (
        `\n      <trkpt lat="${point[0]}" lon="${point[1]}">\n` +
        `        <ele>${point[2]}</ele>\n` +
        "      </trkpt>"
      );
    })
    .join("");

  return (
    gpxHeader +
    trackpointElements +
    (trackpoints.length ? "\n    " : "") +
    gpxFooter
  );
};

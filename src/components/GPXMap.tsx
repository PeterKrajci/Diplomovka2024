import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Polyline,
  useMapEvent,
  Tooltip,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import { useColorGeneration } from "../hooks/useColorGeneration";
import IconMenu from "./Menu";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area } from "recharts";
import TrackSelectionModal from "./TrackSelectionModal";

export type GPXData = string;

export type Position = {
  lat: number;
  lon: number;
  ele: number;
  time: number | null;
};

export type GPXMapProps = {
  positions?: Array<Position>;
};

function MyComponent({ setMenuVisible }) {
  // const [menuVisible, setMenuVisible] = useState(false);
  // const [clickedSegmentIndex, setClickedSegmentIndex] = useState(-1);
  // const [menuPosition, setMenuPosition] = useState({ lat: 0, lng: 0 });
  // const [clickedSegment, setClickedSegment] = useState([]); // New state
  // const [index, setIndex] = useState(-1); // New state

  // const menuRef = useRef(null);

  const handleZoomEnd = (e) => {
    console.log("Zoom level:", e.target.getZoom());
  };

  const handleMapClick = (e) => {
    // const clickLatLng = e.latlng;
    // let trackSegmentClicked = false;
    // for (let i = 0; i < tracks.length; i++) {
    //   const segment = tracks[i];
    //   for (let j = 0; j < segment.length; j++) {
    //     const point = segment[j];
    //     const distance = clickLatLng.distanceTo(point);
    //     if (distance < 50) {
    //       setClickedSegmentIndex(i);
    //       setClickedSegment(segment);
    //       setIndex(j);
    //       setMenuVisible(true);
    //       trackSegmentClicked = true;
    //       break;
    //     }
    //   }
    //   if (trackSegmentClicked) {
    //     break;
    //   }
    // }
    // if (!trackSegmentClicked) {
    //   setMenuVisible(false);
    // }
  };

  // const handleSplitTrack = () => {
  //   if (clickedSegment.length <= 1 || index < 0) {
  //     return; // Do not split if there's only one point
  //   }

  //   const firstSegment = clickedSegment.slice(0, index + 1);
  //   const secondSegment = clickedSegment.slice(index);

  //   if (firstSegment.length > 0 && secondSegment.length > 0) {
  //     // Create a new array for the updated tracks
  //     const updatedTracks = [...tracks];

  //     // Replace the original clickedSegment with the first and second segments
  //     if (clickedSegmentIndex !== null) {
  //       updatedTracks[clickedSegmentIndex] = firstSegment;
  //       updatedTracks.splice(clickedSegmentIndex + 1, 0, secondSegment);
  //       setTracks(updatedTracks);
  //     }
  //   }
  //   setClickedSegmentIndex(-1);
  //   setClickedSegment([]);
  //   setIndex(-1);
  //   setMenuVisible(false); // Close the menu after splitting
  // };

  // const deleteTrackSegment = () => {
  //   if (clickedSegmentIndex >= 0) {
  //     if (clickedSegmentIndex >= 0 && clickedSegmentIndex < tracks.length) {
  //       // Create a new array for the updated tracks
  //       const updatedTracks = [...tracks];

  //       // Remove the track segment at the specified index
  //       updatedTracks.splice(clickedSegmentIndex, 1);

  //       // Update the tracks state with the modified array
  //       setTracks(updatedTracks);
  //     }
  //   }
  //   setClickedSegmentIndex(-1);
  //   setClickedSegment([]);
  //   setIndex(-1);
  //   setMenuVisible(false); // Close the menu after splitting
  // };

  useMapEvent("click", handleMapClick);
  useMapEvent("zoomend", handleZoomEnd);
  return null;
}

const GPXMap: React.FC<GPXMapProps> = ({ positions }) => {
  const defaultStartLatLng = [48.1486, 17.1077];
  const [tracks, setTracks] = useState([positions]);
  const defaultNumberOfColors = 20;
  const { currentColors } = useColorGeneration({ defaultNumberOfColors });
  const [newMarker, setNewMarker] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [clickedSegmentIndex, setClickedSegmentIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({ lat: 0, lng: 0 });
  const [clickedSegment, setClickedSegment] = useState([]); // New state
  const [index, setIndex] = useState(-1); // New state
  const [colorWeight, setcolorWeight] = useState(5); // New state
  const [selectingTrack, setSelectingTrack] = useState(false);
  const [selectTrackCallback, setSelectTrackCallback] = useState(null);

  const menuRef = useRef(null);
  console.log("menuvisible", menuVisible);
  useEffect(() => {
    setTracks([positions]);
  }, [positions]);

  function transformCoordinates(coordinates: number[][][]) {
    let id = 0;
    return coordinates.map((group) => {
      if (group && group.length) {
        return group.map((coord) => ({
          id: id++,
          elevation: coord[2],
          position: {
            lat: coord[0],
            lon: coord[1],
          },
        }));
      }
      return []; // Return an empty array if group is null or empty
    });
  }

  const handleSplitTrack = () => {
    if (clickedSegment.length <= 1 || index < 0) {
      return; // Do not split if there's only one point
    }

    const firstSegment = clickedSegment.slice(0, index + 1);
    const secondSegment = clickedSegment.slice(index);

    if (firstSegment.length > 0 && secondSegment.length > 0) {
      // Create a new array for the updated tracks
      const updatedTracks = [...tracks];

      // Replace the original clickedSegment with the first and second segments
      if (clickedSegmentIndex !== null) {
        updatedTracks[clickedSegmentIndex] = firstSegment;
        updatedTracks.splice(clickedSegmentIndex + 1, 0, secondSegment);
        setTracks(updatedTracks);
      }
    }
    setClickedSegmentIndex(-1);
    setClickedSegment([]);
    setIndex(-1);
    setMenuVisible(false); // Close the menu after splitting
  };

  const deleteTrackSegment = () => {
    if (clickedSegmentIndex >= 0) {
      if (clickedSegmentIndex >= 0 && clickedSegmentIndex < tracks.length) {
        // Create a new array for the updated tracks
        const updatedTracks = [...tracks];

        // Remove the track segment at the specified index
        updatedTracks.splice(clickedSegmentIndex, 1);

        // Update the tracks state with the modified array
        setTracks(updatedTracks);
      }
    }
    setClickedSegmentIndex(-1);
    setClickedSegment([]);
    setIndex(-1);
    setMenuVisible(false); // Close the menu after splitting
  };

  const handleJoinTracks = () => {
    setMenuVisible(false);
    setSelectingTrack(true);
    setSelectTrackCallback((selectedTrack) => {
      const joinedTracks = [...tracks, selectedTrack];
      setTracks(joinedTracks);
      setClickedSegmentIndex(-1);
      setClickedSegment([]);
      setIndex(-1);
      setMenuVisible(false);
      setSelectingTrack(false);
    });
  };

  const handlePolylineClick = (e) => {
    setMenuVisible(true);
    setcolorWeight(8);
    // Prevent the event from propagating to the map click event
    e.originalEvent.stopPropagation();
    const clickLatLng = e.latlng;
    let trackSegmentClicked = false;

    for (let i = 0; i < tracks.length; i++) {
      const segment = tracks[i] || [];
      for (let j = 0; j < segment.length; j++) {
        const point = segment?.[j];
        const distance = clickLatLng.distanceTo(point);
        if (distance < 50) {
          setClickedSegmentIndex(i);
          setClickedSegment(segment);
          setIndex(j);
          trackSegmentClicked = true;
          break;
        }
      }
      if (trackSegmentClicked) {
        break;
      }
    }
  };

  const transformedCoordinates = transformCoordinates(tracks);

  return (
    <>
      <MapContainer
        center={defaultStartLatLng}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {tracks.length
          ? tracks.map(
              (track, index) =>
                positions &&
                positions.length > 0 && (
                  <Polyline
                    key={`track-${index}`}
                    pathOptions={{
                      fillColor: "red",
                      color: `rgb(${currentColors[index]?.r},${currentColors[index]?.g},${currentColors[index]?.b})`,
                      weight: 5,
                    }}
                    positions={track}
                    eventHandlers={{
                      click: (event) => handlePolylineClick(event),
                    }}
                  />
                )
            )
          : null}
        {newMarker.length > 0 && (
          <Marker position={newMarker}>
            <Tooltip>
              <div>
                Latitude: {newMarker[0]}
                <br />
                Longitude: {newMarker[1]}
              </div>
            </Tooltip>
          </Marker>
        )}
        <ZoomControl position="bottomright" />
        <MyComponent setMenuVisible={setMenuVisible}></MyComponent>
      </MapContainer>
      {/*ELEVATIONS CHARTS*/}
      {transformedCoordinates?.[0]?.length > 0 && (
        <div className="recharts">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={800}
              height={200}
              data={transformedCoordinates[0]}
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
              <Tooltip />
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
      )}
      {selectingTrack && (
        <TrackSelectionModal
          tracks={tracks}
          selectedTrackIndex={clickedSegmentIndex}
          onSelect={selectTrackCallback}
          onCancel={() => setSelectingTrack(false)}
        />
      )}
      {menuVisible ? (
        <div
          ref={menuRef}
          style={{
            position: "relative",
            zIndex: 1000,
            //marginLeft: "1000px",
          }}
        >
          <IconMenu
            onClose={() => setMenuVisible(false)}
            onSplit={handleSplitTrack}
            deleteTrackSegment={deleteTrackSegment}
            joinTracks={handleJoinTracks}
          />
        </div>
      ) : null}
    </>
  );
};

export default GPXMap;

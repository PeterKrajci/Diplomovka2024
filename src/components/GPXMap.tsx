import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Polyline,
  Tooltip,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import { useColorGeneration } from "../hooks/useColorGeneration";
import IconMenu from "./Menu";
import { Button } from "@mui/material";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import Loader from "./Page/elements/Loader";
import { AltitudeChart } from "./AltitudeChart";
import { HeartRateChart } from "./HeartRateChart";

export type GPXData = string;

export type Position = {
  lat: number;
  lon: number;
  ele: number;
};

export type GPXMapProps = {
  positions: Array<Position>;
  heartRates: Array<number>;
};

const GPXMap: React.FC<GPXMapProps> = ({ positions = [], heartRates = [] }) => {
  const defaultStartLatLng = [positions[0][0], positions[0][1]] || [
    48.1486, 17.1077,
  ];
  const [tracks, setTracks] = useState([positions]);
  const defaultNumberOfColors = 20;
  const { currentColors } = useColorGeneration({ defaultNumberOfColors });
  const [newMarker, setNewMarker] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [clickedSegmentIndex, setClickedSegmentIndex] = useState(-1);
  const [clickedSegment, setClickedSegment] = useState([]);
  const [index, setIndex] = useState(-1);
  const [colorWeight, setcolorWeight] = useState(5);
  const menuRef = useRef(null);
  const [hoveredPolyline, setHoveredPolyline] = useState<number | null>(null);
  const [disabledPolyline, setDisabledPolyline] = useState<number>(-2);
  const [joiningTrackIndex, setJoiningTrackIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [isMovePointActive, setIsMovePointActive] = useState(false);
  const [drawnPolyline, setDrawnPolyline] = useState([]);
  const [shouldDeletePolyline, setShouldDeletePolyline] = useState(false);
  const [movePoint, setMovePoint] = useState({
    lat: -1,
    lon: -1,
    segmentIndex: -1,
    poinIndex: -1,
  });
  const drawnPolylineLayerRef = useRef();
  const handlePolylineCreation = (e) => {
    const latlngs = e.layer.getLatLngs();
    const coordinates = latlngs.map((latlng) => [latlng.lat, latlng.lng]);
    setDrawnPolyline(coordinates);

    drawnPolylineLayerRef.current = e.layer;
  };

  const handlePolylineHover = (index: number) => {
    if (disabledPolyline !== index) {
      setHoveredPolyline(index);
    }
  };

  const handlePolylineLeave = () => {
    if (disabledPolyline !== index) {
      setHoveredPolyline(null);
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const newLocation = e.target.getLatLng();
    const draggedFromTrackIndex = movePoint.segmentIndex;

    // Get the track from which the marker was dragged
    const draggedFromTrack = tracks[draggedFromTrackIndex] || [];

    // Get the first and last points of the old track
    const firstPoint = draggedFromTrack[0];
    const lastPoint = draggedFromTrack[draggedFromTrack.length - 1];

    // Call OpenRouteService API to get a new track
    const apiKey = "5b3ce3597851110001cf6248a496eac3f113459fa3a3f5453f7a931d";
    const apiUrl =
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";

    const coordinates = [
      [firstPoint[1], firstPoint[0]],
      [newLocation.lng, newLocation.lat],
      [lastPoint[1], lastPoint[0]],
    ];
    const body = JSON.stringify({ coordinates, elevation: true });

    try {
      setLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: body,
      });

      if (response.ok) {
        const data = await response.json();

        // Extract new track coordinates
        const newTrackCoordinates = data.features[0].geometry.coordinates;
        const swappedCoordinates = newTrackCoordinates.map((subarray) => {
          // Swap the first and second elements
          const [first, second, ...rest] = subarray;
          return [second, first, ...rest];
        });

        const tmpTracks = tracks;
        tmpTracks.splice(draggedFromTrackIndex, 1, swappedCoordinates);

        setTracks(tmpTracks);
      } else {
        console.error(
          "Error fetching route from OpenRouteService:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching route from OpenRouteService:", error);
    } finally {
      setLoading(false);
      setMovePoint({
        lat: -1,
        lon: -1,
        segmentIndex: -1,
        poinIndex: -1,
      });

      setIsMovePointActive(false); // Reset move point action
    }
  };

  useEffect(() => {
    setTracks([positions]);
  }, [positions]);

  const transformCoordinates = (coordinates: number[][][]) => {
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

  const joinTracks = () => {
    if (clickedSegmentIndex >= 0) {
      // Disable the clicked polyline
      setDisabledPolyline(clickedSegmentIndex);
      setJoiningTrackIndex(clickedSegmentIndex);
      alert("click on another track you want to join");
      // Now, the user needs to click on another polyline to complete the join
    }

    // Reset the selected polyline index
    setClickedSegment([]);
    setIndex(-1);

    // Close the menu after joining
    setMenuVisible(false);
  };

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

  const handlePolylineClick = async (e, indexxx) => {
    setClickedSegmentIndex(indexxx);
    // Prevent the event from propagating to the map click event
    e.originalEvent.stopPropagation();
    const clickLatLng = e.latlng;
    let trackSegmentClicked = false;
    let point = [-1, -1, -1];
    let miniIndex = -1;
    for (let i = 0; i < tracks.length; i++) {
      const segment = tracks[i] || [];
      for (let j = 0; j < segment.length; j++) {
        point = segment?.[j];
        const distance = clickLatLng.distanceTo(point);
        if (distance < 50) {
          //setClickedSegmentIndex(i);
          setClickedSegment(segment);
          miniIndex = j;
          setIndex(j);
          trackSegmentClicked = true;
          break;
        }
      }
      if (trackSegmentClicked) {
        break;
      }
    }

    setMovePoint({
      lat: point[0],
      lon: point[1],
      segmentIndex: indexxx,
      poinIndex: miniIndex,
    });

    if (
      indexxx >= 0 &&
      disabledPolyline === joiningTrackIndex &&
      tracks[joiningTrackIndex] &&
      tracks[indexxx]
    ) {
      const firstPoint =
        tracks[joiningTrackIndex]?.[tracks[joiningTrackIndex].length - 1];

      const clickedSegmentLength = tracks[indexxx]?.length;
      const secondPoint =
        clickedSegmentLength > 0 ? tracks[indexxx]?.[0] : null;

      if (firstPoint && secondPoint) {
        const apiKey =
          "5b3ce3597851110001cf6248a496eac3f113459fa3a3f5453f7a931d";
        const apiUrl =
          "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";

        const coordinates = [
          [firstPoint[1], firstPoint[0]],
          [secondPoint[1], secondPoint[0]],
        ];
        const body = JSON.stringify({ coordinates, elevation: true });

        try {
          setLoading(true);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Accept:
                "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
              "Content-Type": "application/json",
              Authorization: apiKey,
            },
            body: body,
          });

          if (response.ok) {
            const data = await response.json();
            const newTrackCoordinates = data.features[0].geometry.coordinates;

            const swappedCoordinates = newTrackCoordinates.map((subarray) => {
              // Swap the first and second elements
              const [first, second, ...rest] = subarray;
              return [second, first, ...rest];
            });

            const extendedFirstPointTrack =
              tracks[joiningTrackIndex].concat(swappedCoordinates);

            const updatedTracks = extendedFirstPointTrack.concat(
              tracks[indexxx]
            );

            const filteredTracks = tracks.filter(
              (_, index) => !(index === joiningTrackIndex || index === indexxx)
            );
            filteredTracks.push(updatedTracks);

            setTracks(filteredTracks);
            setJoiningTrackIndex(-1);
            setMenuVisible(false);
          } else {
            console.error(
              "Error fetching route from OpenRouteService:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching route from OpenRouteService:", error);
        } finally {
          setLoading(false);

          // Reset the relevant state variables in the finally block
          setDisabledPolyline(-20);
          setClickedSegmentIndex(-1);
          setClickedSegment([]);
          setIndex(-1);
        }
      }
      setDisabledPolyline(-20);
    } else {
      setMenuVisible(true);
      setcolorWeight(8);
    }
  };

  useEffect(() => {
    const fetchTrack = async () => {
      if (drawnPolyline.length > 1) {
        const apiKey =
          "5b3ce3597851110001cf6248a496eac3f113459fa3a3f5453f7a931d";
        const apiUrl =
          "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";

        const swappedCoordinates = drawnPolyline.map((subarray) => [
          subarray[1], // Swap the first and second elements
          subarray[0],
        ]);

        const body = JSON.stringify({
          coordinates: swappedCoordinates,
          elevation: true,
        });

        try {
          setLoading(true);
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Accept:
                "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
              "Content-Type": "application/json",
              Authorization: apiKey,
            },
            body: body,
          });

          if (response.ok) {
            const data = await response.json();

            // Extract new track coordinates
            const newTrackCoordinates = data.features[0].geometry.coordinates;
            const swappedCoordinates = newTrackCoordinates.map((subarray) => [
              subarray[1],
              subarray[0],
              ...subarray.slice(2),
            ]);

            setTracks((prevTracks) => [...prevTracks, swappedCoordinates]);
          } else {
            console.error(
              "Error fetching route from OpenRouteService:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching route from OpenRouteService:", error);
        } finally {
          setDrawnPolyline([]);
          setLoading(false);
        }
      }
    };

    fetchTrack();
  }, [drawnPolyline]);

  useEffect(() => {
    if (shouldDeletePolyline && drawnPolylineLayerRef.current) {
      // Remove the drawn polyline layer from the map
      drawnPolylineLayerRef.current.remove();

      // Reset the state variable
      setShouldDeletePolyline(false);
    }
  }, [shouldDeletePolyline]);

  const transformedCoordinates = useMemo(
    () => transformCoordinates(tracks),
    [tracks]
  );

  return (
    <>
      {isMovePointActive && (
        <Button onClick={() => setIsMovePointActive(false)}>
          Cancel moving track
        </Button>
      )}
      {loading && <Loader />} {/* Display loader when loading is true */}
      <MapContainer
        center={defaultStartLatLng}
        zoom={13}
        style={{
          height: "650px",
          width: "100%",
          position: "relative",
          zIndex: 0,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {tracks?.length && tracks?.[0]?.length
          ? tracks.map((track, index) => (
              <Polyline
                key={`track-${index}`}
                pathOptions={{
                  fillColor: "red",
                  color:
                    disabledPolyline === index
                      ? "grey"
                      : `rgb(${currentColors[index]?.r},${currentColors[index]?.g},${currentColors[index]?.b})`,
                  weight:
                    hoveredPolyline === index ? colorWeight + 3 : colorWeight,
                }}
                positions={track}
                eventHandlers={{
                  click: (event) =>
                    disabledPolyline === index
                      ? null
                      : handlePolylineClick(event, index),
                  mouseover: () => handlePolylineHover(index),
                  mouseout: handlePolylineLeave,
                }}
              />
            ))
          : null}
        {isMovePointActive && (
          <Marker
            position={{ lat: movePoint.lat, lng: movePoint.lon }}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          >
            <Tooltip>Drag me to change track direction</Tooltip>
          </Marker>
        )}
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
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={(e) => handlePolylineCreation(e)}
            draw={{
              polyline: true,
              circle: false,
              rectangle: false,
              marker: false,
              circlemarker: false,
              polygon: false,
            }}
          />
        </FeatureGroup>
        <ZoomControl position="bottomright" />
      </MapContainer>
      {/*ELEVATIONS CHARTS*/}
      {transformedCoordinates?.[0]?.length > 0 && (
        <AltitudeChart
          clickedSegmentIndex={clickedSegmentIndex}
          coordinates={transformedCoordinates}
          setNewMarker={setNewMarker}
        />
      )}
      {transformedCoordinates?.[0]?.length > 0 && heartRates.length > 0 && (
        <HeartRateChart
          heartRates={heartRates}
          clickedSegmentIndex={clickedSegmentIndex}
          coordinates={transformedCoordinates}
          setNewMarker={setNewMarker}
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
            joinTracks={joinTracks}
            setIsMovePointActive={setIsMovePointActive}
          />
        </div>
      ) : null}
    </>
  );
};

export default GPXMap;

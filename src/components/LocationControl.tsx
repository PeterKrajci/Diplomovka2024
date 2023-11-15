import React from "react";
import { useMap } from "react-leaflet";

const LocationControl: React.FC = () => {
  const map = useMap();

  const panToUserLocation = () => {
    map.locate();
  };

  return <button onClick={panToUserLocation}>Pan to My Location</button>;
};

export default LocationControl;

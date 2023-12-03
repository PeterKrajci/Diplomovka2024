// GPXMapComponents/Loader.tsx
import React from "react";

const Loader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.8)",
      zIndex: 1000,
    }}
  >
    Loading...
  </div>
);

export default Loader;

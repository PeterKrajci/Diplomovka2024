// TrackSelectionModal.tsx
import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useColorGeneration } from "../hooks/useColorGeneration";

type TrackSelectionModalProps = {
  tracks: Array<any>;
  selectedTrackIndex: number | null;
  onSelect: (selectedTrack: any) => void;
  onCancel: () => void;
};

const TrackSelectionModal: React.FC<TrackSelectionModalProps> = ({
  tracks,
  selectedTrackIndex,
  onSelect,
  onCancel,
}) => {
  const { currentColors } = useColorGeneration({ defaultNumberOfColors: 20 });

  return (
    <Modal open={true} onClose={onCancel}>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "20%",
          backgroundColor: "#fff", // Set your background color
          overflowY: "auto",
          padding: "16px",
        }}
      >
        <h2>Select a Track</h2>
        {tracks.map((track, index) => (
          <Button
            key={`track-${index}`}
            variant="contained"
            color="primary"
            disabled={selectedTrackIndex === index}
            onClick={() => onSelect(track)}
            style={{
              backgroundColor: `rgb(${currentColors[index]?.r},${currentColors[index]?.g},${currentColors[index]?.b})`,
              marginBottom: "8px",
            }}
          >
            Track-{index}
          </Button>
        ))}
        <Button variant="contained" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default TrackSelectionModal;

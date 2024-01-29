import React from "react";

interface GPXUploaderProps {
  onFileSelect: (gpxData: Blob | undefined) => void;
}

const GPXUploader: React.FC<GPXUploaderProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    onFileSelect(selectedFile);
    event.target.value = "";
  };

  return (
    <div>
      <input type="file" accept=".gpx,.tcx,.fit" onChange={handleFileChange} />
    </div>
  );
};

export default GPXUploader;

import React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type MenuProps = {
  onClose: () => void;
  onSplit: () => void;
  joinTracks: () => void;
  deleteTrackSegment: () => void;
  setIsMovePointActive: (arg: boolean) => void;
};

const IconMenu: React.FC<MenuProps> = ({
  onClose,
  onSplit,
  deleteTrackSegment,
  joinTracks,
  setIsMovePointActive,
}) => {
  const handleSplit = () => {
    onSplit();
    onClose();
  };

  const handleSegmentRemoval = () => {
    deleteTrackSegment();
    onClose();
  };

  const handleJoin = () => {
    joinTracks();
    onClose();
  };
  const handleMovePointClick = () => {
    alert("Drag the marker to change track direction");
    setIsMovePointActive(true);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{ position: "relative" }}
        >
          <CloseIcon />
        </IconButton>
        <MenuList className="mt-10">
          <MenuItem onClick={handleMovePointClick}>
            <ListItemIcon>
              {/* Add an appropriate icon for moving point */}
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move Point</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Move a point in the track
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleSplit}>
            <ListItemIcon>
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText>Split</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Split the track
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleSegmentRemoval}>
            <ListItemIcon>
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Delete this track
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleJoin}>
            <ListItemIcon>
              {/* Add an appropriate icon for joining tracks */}
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText>Join Tracks</ListItemText>
            <Typography variant="body2" color="text.secondary">
              Join this track with another
            </Typography>
          </MenuItem>
        </MenuList>
      </Paper>
    </Dialog>
  );
};

export default IconMenu;

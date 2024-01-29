import React, { useEffect, useState } from "react";
import GPXUploader from "./GPXUploader";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Snackbar,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export type Position = [number, number, number];

const HomePage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/trackdata/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDocuments(data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, []);

  const handleFileSelect = (selectedFile: Blob | undefined) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://127.0.0.1:8000/upload-file", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          setSnackbarMessage("File uploaded successfully");
          setSnackbarOpen(true);
          // Update UI or perform other actions as needed
        })
        .catch((error) => {
          console.error("Error:", error);
          setSnackbarMessage("Error uploading file");
          setSnackbarOpen(true);
          // Handle error, display error message, etc.
        });
    } else {
      console.error("No file selected");
    }
  };

  const handleDeleteDocument = (
    documentId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    fetch(`http://127.0.0.1:8000/trackdata/${documentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage("Document deleted successfully");
        setSnackbarOpen(true);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== documentId)
        );
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
        setSnackbarMessage("Error deleting document");
        setSnackbarOpen(true);
      });
  };

  const handleListItemClick = (documentId: string) => {
    navigate(`/gpxmap/${documentId}`);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        GPX Uploader
      </Typography>
      <Box display="flex">
        <Box flex={1} mr={2}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <GPXUploader onFileSelect={handleFileSelect} />
          </Paper>
        </Box>
        <Box flex={1}>
          <Paper
            elevation={3}
            style={{
              padding: "12px",
              width: "300px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <List>
              {documents.map((document) => (
                <ListItem
                  key={document.id}
                  sx={{
                    borderBottom: 1,
                    borderColor: "grey.300",
                    transition: "box-shadow 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={() => handleListItemClick(document.id)}
                >
                  <ListItemText primary={`Track-${document.id}`} />
                  <ListItemIcon>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(event) =>
                        handleDeleteDocument(document.id, event)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default HomePage;

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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export type Position = [number, number, number];

const HomePage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8000/trackdata/mine", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
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

      fetch("http://localhost:8000/upload-file", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setSnackbarMessage("File uploaded successfully");
          setSnackbarOpen(true);

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
          setSnackbarMessage("Error uploading file");
          setSnackbarOpen(true);
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
      credentials: "include",
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
      <Box display="flex" flexDirection="column">
        <Button
          title="Logout"
          onClick={signOut}
          sx={{ alignSelf: "flex-start", mb: 2 }}
        >
          Log out
        </Button>
        <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
          <GPXUploader onFileSelect={handleFileSelect} />
          <List sx={{ mt: 2, width: "100%" }}>
            {documents?.map((document) => (
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

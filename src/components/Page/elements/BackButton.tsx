import { FC } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Props = {
  backButtonRoute?: string;
};

export const BackButton: FC<Props> = ({ backButtonRoute = ".." }) => {
  return (
    <Link to={backButtonRoute} style={{ textDecoration: "none" }}>
      <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />}>
        {"Go back"}
      </Button>
    </Link>
  );
};

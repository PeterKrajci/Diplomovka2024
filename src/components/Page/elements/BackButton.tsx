import { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  backButtonRoute?: string;
};

export const BackButton: FC<Props> = ({ backButtonRoute = ".." }) => {
  return (
    <Link className="flex flex-row items-center gap-3" to={backButtonRoute}>
      {"Go back"}
    </Link>
  );
};

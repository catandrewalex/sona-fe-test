import React from "react";
import { Alert, Typography } from "@mui/material";
import Link from "next/link";
import BoldText from "@sonamusica-fe/components/BoldText";

const WarningCRUD = ({ link }: { link?: string }): JSX.Element => {
  return (
    <Alert sx={{ my: 2 }} severity="warning">
      <Typography>WARNING</Typography>
      <BoldText>Creating, updating, or deleting</BoldText> from this page may cause{" "}
      <BoldText>inconsistencies</BoldText> to your system. Please avoid doing these actions{" "}
      <BoldText>unless you really know what you are doing.</BoldText>{" "}
      <Typography variant="body2">
        If you wish to manage this entity, you can visit{" "}
        <Link href={link || "#"}>
          <Typography variant="body2" sx={{ cursor: "pointer" }} component="span" color="blue">
            this page
          </Typography>
        </Link>{" "}
        instead.
      </Typography>
    </Alert>
  );
};

export default WarningCRUD;

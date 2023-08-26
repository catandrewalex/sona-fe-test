import Image from "next/image";
import { Box } from "@mui/material";

const Error403 = (): JSX.Element => {
  return (
    <Box
      className="flex flex-full-percent flex-column align-center"
      sx={{ height: "calc(100vh - 96px)" }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <Image unoptimized src="/403.png" alt="unauthorized" height="350" width="350" />
        </div>
        <div>
          <h1 style={{ textAlign: "center" }}>Unauthorized!</h1>
          <p style={{ textAlign: "center" }}>
            Sorry, this page is only for some user with spesific permissions.
          </p>
        </div>
      </div>
    </Box>
  );
};

export default Error403;

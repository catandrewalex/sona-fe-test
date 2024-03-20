import Image from "next/image";
import { Box } from "@mui/material";

const Error404 = (): JSX.Element => {
  return (
    <Box className="flex flex-full-percent flex-column align-center">
      <div>
        <div style={{ textAlign: "center" }}>
          <Image unoptimized src="/404.png" alt="not found" height={250} width={250} />
        </div>
        <div>
          <h1 style={{ textAlign: "center" }}>Page Not Found</h1>
          <p style={{ textAlign: "center" }}>Sorry, we cannot find any pages with that URL.</p>
        </div>
      </div>
    </Box>
  );
};

export default Error404;

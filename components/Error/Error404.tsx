import Box from "@mui/material/Box";
import Image from "next/image";

const Error404 = (): JSX.Element => {
  return (
    <Box className="flex flex-full-percent flex-column align-center">
      <div>
        <div style={{ textAlign: "center" }}>
          <Image src="/404.png" alt="not found" height={250} width={250} />
        </div>
        <div>
          <h1 style={{ textAlign: "center" }}>Page Not Found</h1>
          <p style={{ textAlign: "center" }}>Sorry, you may have entered wrong URL.</p>
        </div>
      </div>
    </Box>
  );
};

export default Error404;

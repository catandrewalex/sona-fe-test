import Stack from "@mui/material/Stack";
import Image from "next/image";

const ErrorDataGridEmpty = (): JSX.Element => {
  return (
    <Stack height="70%" alignItems="center" justifyContent="center" sx={{ pt: 20 }}>
      <div>
        <div style={{ textAlign: "center" }}>
          <Image src="/empty.png" alt="not found" height={250} width={250} />
        </div>
        <div>
          <h1 style={{ textAlign: "center" }}>No Rows</h1>
          <p style={{ textAlign: "center" }}>Empty Data</p>
        </div>
      </div>
    </Stack>
  );
};

export default ErrorDataGridEmpty;

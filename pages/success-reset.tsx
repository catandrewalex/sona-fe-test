import { ArrowBackOutlined } from "@mui/icons-material";
import { Paper, Typography, Button, styled, Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const LoginContainer = styled(Paper)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper
}));

const SuccessReset = (): JSX.Element => {
  const router = useRouter();
  return (
    <LoginContainer data-testid="LoginPageContainer">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image unoptimized src="/logo.png" width={200} height={95} />
        <Paper
          elevation={5}
          sx={{
            px: 3,
            py: 1,
            mt: 5,
            width: "500px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography
            align="center"
            sx={{ my: 2 }}
            variant="h4"
            data-testid="ForgotPasswordSuccess-Title"
          >
            Link was sent!
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            Please check your email for reset password link.
          </Typography>
          <Button
            onClick={() => router.replace("/")}
            sx={{ mb: 2 }}
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
            data-testid="ForgotPasswordSuccess-BackButton"
          >
            Return to Login Page
          </Button>
        </Paper>
      </Box>
    </LoginContainer>
  );
};

export default SuccessReset;

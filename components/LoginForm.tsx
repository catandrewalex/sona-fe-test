import React, { useState, useEffect } from "react";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useRouter } from "next/router";
import { Paper, Box, Button, Typography, Grid } from "@mui/material";
import Image from "next/image";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import { required, validEmail } from "@sonamusica-fe/utils/ValidationUtil";
import { ArrowBackOutlined } from "@mui/icons-material";

enum State {
  LOGIN,
  FORGOT_PASSWORD
}

const LoginButton = (): JSX.Element => {
  const [state, setState] = useState<State>(State.LOGIN);
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<string>();
  const [errorPassword, setErrorPassword] = useState<string>();

  const { setUser } = useUser((state) => ({
    setUser: state.setUser
  }));
  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  const clickHandler = () => {
    try {
      let emailPassed = false,
        passwordPassed = false;
      if (!required(email)) setErrorEmail("Email is required!");
      else if (!validEmail(email)) setErrorEmail("Email is not valid!");
      else {
        setErrorEmail("");
        emailPassed = true;
      }

      switch (state) {
        case State.LOGIN: {
          if (!required(password)) setErrorPassword("Password is required!");
          else {
            setErrorPassword("");
            passwordPassed = true;
          }
          if (emailPassed && passwordPassed) {
            setLoading(true);
            // const responseLogin = await API.Login(email, password);
            // const user = apiTransformer(responseLogin, true);
            // console.log("user", user);
          }
          break;
        }
        case State.FORGOT_PASSWORD: {
          if (emailPassed) {
            setLoading(true);
          }
        }
      }

      // if (error.length > 0) {
      //   showSnackbar(error[0].message, "error");
      //   return;
      // }
      // if (meta) {
      //   const { redirect: url } = meta;
      //   window.onmessage = (e: MessageEvent) => {
      //     const response = e.data as LoginResponse;
      //     if (response.status === 200 && response.user) {
      //       const permissions: Set<string> = new Set<string>();
      //       response.user.roles.forEach((role) => {
      //         role.permissions
      //           .map((permission) => permission.name)
      //           .forEach(permissions.add, permissions);
      //       });
      //       setPermissions(Array.from(permissions));
      //       setUser(response.user);
      //       setRoles(response.user.roles);
      //       setTeams(response.user.teams);
      //       showSnackbar("Login Success", "success");
      //       startSchedule(response.user);
      //     } else if (response.status === 400 || response.status === 403) {
      //       showSnackbar(`Error ${response.status}: ${response.error}`, "error");
      //     }
      //   };

      //   const newWindow = window.open(url, "Google Sign In", "height=600, width=450");
      //   if (newWindow && document.hasFocus()) {
      //     newWindow.focus();
      //   }
      // }
    } catch (err) {
      showSnackbar(`Unexpected error!`, "error");
    }
  };

  return (
    <>
      <Image src="/logo.png" width={200} height={95} />
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
        {state === State.LOGIN ? (
          <>
            <Box sx={{ mt: 1 }}>
              <TextInput
                sx={{ my: 2 }}
                label="Email"
                value={email}
                errorMsg={errorEmail}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                sx={{ my: 2 }}
                label="Password"
                value={password}
                errorMsg={errorPassword}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Button
                sx={{ my: 2 }}
                variant="text"
                color="secondary"
                disabled={loading}
                onClick={() => setState(State.FORGOT_PASSWORD)}
              >
                Forgot Password?
              </Button>
              <SubmitButton loading={loading} submitText="Login" onClick={clickHandler} fullWidth />
              {/* <Button sx={{ my: 1 }} variant="text" color="secondary">
            Create New User
          </Button> */}
            </Box>
          </>
        ) : (
          <Box pt={2}>
            <Typography variant="h4" align="center">
              Forgot Password
            </Typography>
            <TextInput
              sx={{ my: 2 }}
              label="Email"
              value={email}
              errorMsg={errorEmail}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} xl={2}>
                <Button
                  sx={{ my: 2 }}
                  variant="outlined"
                  color="inherit"
                  onClick={() => setState(State.LOGIN)}
                  startIcon={<ArrowBackOutlined />}
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={12} md={9} xl={10} sx={{ my: "auto" }}>
                <SubmitButton
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  loading={loading}
                  submitText="Send Confirmation Link"
                  onClick={clickHandler}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </>
  );
};
export default LoginButton;

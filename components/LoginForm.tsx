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
import { LoginResponse } from "@sonamusica-fe/types";
import { setCookie } from "@sonamusica-fe/utils/BrowserUtil";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";

enum State {
  LOGIN,
  FORGOT_PASSWORD,
  SUCCESS_FORGOT_PASSWORD
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

  const submitHandler = () => {
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
            API.Login(email, password)
              .then((responseLogin) => {
                const user = apiTransformer(responseLogin, true) as LoginResponse;
                setUser(user.user);
                const expired = new Date();
                expired.setTime(expired.getTime() + 24 * 60 * 60 * 1000);
                setCookie("SNMC", user.authToken, expired.toUTCString(), "");
                setCookie("SNMC_ID", user.user.id.toString(), expired.toUTCString(), "");
              })
              .finally(() => setLoading(false));
          }
          break;
        }
        case State.FORGOT_PASSWORD: {
          if (emailPassed) {
            setLoading(true);
            API.ForgotPassword(email)
              .then((responseForgotPassword) => {
                apiTransformer(responseForgotPassword);
                setState(State.SUCCESS_FORGOT_PASSWORD);
              })
              .finally(() => setLoading(false));
          }
        }
      }
    } catch (err) {
      showSnackbar(`Unexpected error!`, "error");
    }
  };

  let content = null;

  switch (state) {
    case State.LOGIN: {
      content = (
        <Form
          onSubmit={submitHandler}
          formSubmit={
            <SubmitButtonContainer spacing={2}>
              <SubmitButton
                align="center"
                xs={12}
                md={12}
                lg={12}
                xl={12}
                regular
                submitText="Forgot Password?"
                variant="text"
                color="secondary"
                disabled={loading}
                onClick={() => setState(State.FORGOT_PASSWORD)}
              />
              <SubmitButton
                xs={12}
                md={12}
                lg={12}
                xl={12}
                loading={loading}
                submitText="Login"
                fullWidth
              />
            </SubmitButtonContainer>
          }
        >
          <FormField lg={12}>
            <TextInput
              label="Email"
              type="email"
              value={email}
              errorMsg={errorEmail}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <FormField lg={12} sx={{ pt: "0px !important" }}>
            <TextInput
              label="Password"
              type="password"
              value={password}
              errorMsg={errorPassword}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        </Form>
      );
      break;
    }
    case State.FORGOT_PASSWORD: {
      content = (
        <Box pt={2}>
          <Typography variant="h4" align="center">
            Forgot Password
          </Typography>
          <Form
            onSubmit={submitHandler}
            formSubmit={
              <SubmitButtonContainer spacing={2}>
                <SubmitButton
                  regular
                  xs={12}
                  md={3}
                  lg={3}
                  xl={2}
                  variant="outlined"
                  color="inherit"
                  onClick={() => setState(State.LOGIN)}
                  startIcon={<ArrowBackOutlined />}
                  fullWidth
                  submitText="Back"
                />
                <SubmitButton
                  xs={12}
                  md={9}
                  lg={9}
                  xl={10}
                  loading={loading}
                  submitText="Send Confirmation Link"
                  fullWidth
                />
              </SubmitButtonContainer>
            }
          >
            <FormField lg={12}>
              <TextInput
                sx={{ my: 2 }}
                label="Email"
                value={email}
                errorMsg={errorEmail}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </Form>
        </Box>
      );
      break;
    }
    case State.SUCCESS_FORGOT_PASSWORD: {
      content = (
        <>
          <Typography align="center" sx={{ my: 2 }} variant="h4">
            Link was sent!
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            Please check your email for reset password link.
          </Typography>
          <Button
            onClick={() => setState(State.LOGIN)}
            sx={{ mb: 2 }}
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
          >
            Return to Login Page
          </Button>
        </>
      );
    }
  }

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
        {content}
      </Paper>
    </>
  );
};
export default LoginButton;

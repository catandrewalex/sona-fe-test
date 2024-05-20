import React, { useState } from "react";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Paper, Box, Typography } from "@mui/material";
import Image from "next/image";
import { ArrowBackOutlined } from "@mui/icons-material";
import { LoginResponse } from "@sonamusica-fe/types";
import { setCookie } from "@sonamusica-fe/utils/BrowserUtil";
import { FailedResponse } from "api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { useRouter } from "next/router";

enum State {
  LOGIN,
  FORGOT_PASSWORD
}

const LoginForm = (): JSX.Element => {
  const [state, setState] = useState<State>(State.LOGIN);

  const { setUser } = useUser((state) => ({
    setUser: state.setUser
  }));
  const apiTransformer = useApiTransformer();

  const router = useRouter();

  const { formRenderer: formRendererLogin } = useFormRenderer<{ email: string; password: string }>(
    {
      disableUseOfDefaultFormConfig: true,
      disablePromptCancelButtonDialog: true,
      submitContainerProps: { spacing: 2, marginBottom: 2 },
      submitButtonProps: {
        xs: 12,
        md: 12,
        lg: 12,
        xl: 12,
        submitText: "Login",
        testIdContext: "Login"
      },
      cancelButtonProps: {
        xs: 12,
        md: 12,
        lg: 12,
        xl: 12,
        submitText: "Forgot Password",
        variant: "text",
        color: "secondary",
        onClick: () => setState(State.FORGOT_PASSWORD),
        testIdContext: "Login-ForgotPassword"
      },
      fields: [
        {
          type: "text",
          label: "Username or Email",
          name: "email",
          inputProps: { testIdContext: "LoginEmail", required: true },
          validations: [{ name: "required" }],
          formFieldProps: { lg: 12, md: 12, sm: 12, xs: 12 }
        },
        {
          type: "text",
          label: "Password",
          name: "password",
          inputProps: { testIdContext: "LoginPassword", required: true, type: "password" },
          validations: [{ name: "required" }],
          formFieldProps: { lg: 12, md: 12, sm: 12, xs: 12, sx: { pt: "0px !important" } }
        }
      ],
      submitHandler: async (data, errors) => {
        if (errors.email || errors.password) return Promise.reject();
        const responseLogin = await API.Login(data.email, data.password);
        const userTemp = apiTransformer(responseLogin, true);
        if (Object.getPrototypeOf(userTemp) !== FailedResponse.prototype) {
          const user = userTemp as LoginResponse;
          setUser(user.user);
          const expired = new Date();
          const time24Hour = 24 * 60 * 60 * 1000;
          expired.setTime(expired.getTime() + time24Hour);
          setCookie("SNMC", user.authToken, expired.toUTCString(), "");
          setCookie("SNMC_ID", user.user.userId.toString(), expired.toUTCString(), "");
        } else {
          return userTemp as FailedResponse;
        }
      },
      errorResponseMapping: {
        password: "password",
        email: "usernameOrEmail"
      }
    },
    { email: "", password: "" }
  );

  const { formRenderer: formRendererForgotPassword } = useFormRenderer<{ email: string }>(
    {
      disablePromptCancelButtonDialog: true,
      disableUseOfDefaultFormConfig: true,
      submitContainerProps: { spacing: 2, marginBottom: 2 },
      submitButtonProps: {
        xs: 12,
        md: 9,
        lg: 9,
        xl: 10,
        submitText: "Send Confirmation Link",
        testIdContext: "ForgotPassword",
        fullWidth: true
      },
      cancelButtonProps: {
        xs: 12,
        md: 3,
        lg: 3,
        xl: 2,
        submitText: "Back",
        testIdContext: "ForgotPassword-Back",
        onClick: () => setState(State.LOGIN),
        startIcon: <ArrowBackOutlined />,
        fullWidth: true,
        variant: "outlined",
        color: "secondary"
      },
      fields: [
        {
          type: "text",
          label: "Email",
          name: "email",
          inputProps: { testIdContext: "ForgotPassword", required: true, sx: { my: 2 } },
          validations: [{ name: "required" }, { name: "email" }],
          formFieldProps: { lg: 12, xs: 12 }
        }
      ],
      submitHandler: async (data, errors) => {
        if (errors.email) return Promise.resolve();

        const responseForgotPassword = await API.ForgotPassword(data.email);
        const parsedResponse = apiTransformer(responseForgotPassword);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          router.replace("/success-reset");
        } else {
          return parsedResponse as FailedResponse;
        }
      },
      errorResponseMapping: {
        email: "email"
      }
    },
    { email: "" }
  );

  let content = null;

  switch (state) {
    case State.LOGIN: {
      content = formRendererLogin();
      break;
    }
    case State.FORGOT_PASSWORD: {
      content = (
        <Box pt={2}>
          <Typography variant="h4" align="center">
            Forgot Password
          </Typography>
          {formRendererForgotPassword()}
        </Box>
      );
      break;
    }
  }

  return (
    <>
      <Image unoptimized src="/logo.png" width={200} height={95} />
      <Paper
        elevation={5}
        sx={{
          px: 3,
          py: 1,
          mx: 2,
          mt: 5,
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {content}
      </Paper>
    </>
  );
};
export default LoginForm;

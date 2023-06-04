import PageContainer from "@sonamusica-fe/components/PageContainer";
import Image from "next/image";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import { useCheckMatch, useCheckRequired } from "@sonamusica-fe/utils/ValidationUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse } from "api";

const ResetPassword = (): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const appFinishLoading = useApp((state) => state.appFinishLoading);
  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  const checkPassword = useCheckRequired(setErrorPassword, "Password");
  const checkPasswordConfirmationRequired = useCheckRequired(
    setErrorConfirmPassword,
    "Confirmation Password"
  );
  const checkPasswordConfirmationMatch = useCheckMatch(
    setErrorConfirmPassword,
    "Password & Confirmation Password"
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (router.query.token === undefined || router.query.token === "") {
        appFinishLoading();
        showSnackbar("Reset Password token is invalid!", "error");
        router.replace("/");
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  const submitHandler = () => {
    const finalCheckPassword = checkPassword(password);
    let finalCheckPasswordConfirm = checkPasswordConfirmationRequired(confirmPassword);

    if (finalCheckPasswordConfirm) {
      finalCheckPasswordConfirm = checkPasswordConfirmationMatch(password, confirmPassword);
    }

    if (finalCheckPassword && finalCheckPasswordConfirm) {
      setLoading(true);
      API.ResetPassword(router.query.token as string, password)
        .then((responseResetPassword) => {
          const result = apiTransformer(responseResetPassword, true);
          if (Object.getPrototypeOf(result) !== FailedResponse.prototype) {
            router.replace("/");
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <PageContainer noAuth noNavigation>
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
          <Box pt={2}>
            <Typography variant="h4" align="center">
              Reset Password
            </Typography>
            <Form
              onSubmit={submitHandler}
              formSubmit={
                <SubmitButtonContainer marginBottom={2}>
                  <SubmitButton
                    testIdContext="ResetPassword"
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    fullWidth
                    loading={loading}
                  />
                </SubmitButtonContainer>
              }
            >
              <FormField lg={12}>
                <TextInput
                  label="New Password"
                  type="password"
                  required
                  value={password}
                  errorMsg={errorPassword}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPassword(e.target.value);
                  }}
                  testIdContext="ResetPassword-Password"
                />
              </FormField>
              <FormField lg={12} sx={{ pt: "0px !important" }}>
                <TextInput
                  label="Confirm New Password"
                  type="password"
                  required
                  value={confirmPassword}
                  errorMsg={errorConfirmPassword}
                  disabled={loading}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (checkPasswordConfirmationRequired(e.target.value)) {
                      checkPasswordConfirmationMatch(password, e.target.value);
                    }
                  }}
                  testIdContext="ResetPassword-PasswordConfirm"
                />
              </FormField>
            </Form>
          </Box>
        </Paper>
      </>
    </PageContainer>
  );
};

export default ResetPassword;

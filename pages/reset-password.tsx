import PageContainer from "@sonamusica-fe/components/PageContainer";
import Image from "next/image";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse } from "api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";

const ResetPassword = (): JSX.Element => {
  const router = useRouter();
  const appFinishLoading = useApp((state) => state.appFinishLoading);
  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  const { formRenderer } = useFormRenderer<{ password: string; confirmPassword: string }>(
    {
      submitContainerProps: { marginBottom: 2 },
      promptCancelButtonDialog: true,
      submitButtonProps: { testIdContext: "ResetPassword", xs: 12, md: 12, lg: 12, xl: 12 },
      fields: [
        {
          type: "text",
          name: "password",
          label: "New Password",
          formFieldProps: { lg: 12 },
          inputProps: { testIdContext: "ResetPassword-Password", type: "password" },
          validations: [{ name: "required" }]
        },
        {
          type: "text",
          name: "confirmPassword",
          label: "Confirm New Password",
          formFieldProps: { lg: 12, sx: { pt: "0px !important" } },
          inputProps: { testIdContext: "ResetPassword-PasswordConfirm", type: "password" },
          validations: [
            { name: "required" },
            { name: "match", parameters: { matcherField: "password", matcherLabel: "Password" } }
          ]
        }
      ],
      errorResponseMapping: {
        password: "newPassword"
      },
      submitHandler: async (formData, error) => {
        if (error.confirmPassword || error.password) return Promise.reject();

        const response = await API.ResetPassword(router.query.token as string, formData.password);
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        } else {
          router.replace("/");
        }
      }
    },
    { confirmPassword: "", password: "" }
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
            {formRenderer()}
          </Box>
        </Paper>
      </>
    </PageContainer>
  );
};

export default ResetPassword;

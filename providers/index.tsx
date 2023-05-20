import React, { useRef } from "react";
import SnackProvider from "@sonamusica-fe/providers/SnackProvider";
import ThemeProvider from "@sonamusica-fe/providers/ThemeProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import { LocalizationProvider } from "@mui/lab";
import { AlertDialogProvider } from "./AlertDialogProvider";
import { SnackbarKey, SnackbarProvider } from "notistack";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

/**
 * Providers component prop types.
 * @typedef {Object} ProvidersProps
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 */
type ProvidersProps = {
  children: JSX.Element | JSX.Element[];
};

const Providers = ({ children }: ProvidersProps): JSX.Element => {
  // add action to all snackbars
  const notistackRef = useRef<SnackbarProvider | null>(null);
  const onClickDismiss = (key: SnackbarKey) => () => {
    if (notistackRef && notistackRef.current) notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={1}
          action={(key: SnackbarKey) => (
            <IconButton sx={{ color: "white" }} onClick={onClickDismiss(key)}>
              <HighlightOffIcon />
            </IconButton>
          )}
        >
          <SnackProvider>
            <AlertDialogProvider>{children}</AlertDialogProvider>
          </SnackProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Providers;

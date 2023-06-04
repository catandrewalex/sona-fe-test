import { CSSProperties } from "@mui/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { createContext, useState } from "react";

export interface AlertDialogProviderProps {
  children: React.ReactNode;
}

type DialogConfig = {
  title: string;
  content: string | JSX.Element;
  style?: CSSProperties;
  informationDialog?: boolean;
};

export type AlertDialogContextValue = {
  showDialog: (
    config: DialogConfig,
    positiveAction?: () => void,
    negativeAction?: () => void
  ) => void;
};

type AlertDialogState = {
  open: boolean;
  title: string;
  content: string | JSX.Element;
  style?: CSSProperties;
  positiveAction?: VoidFunction;
  negativeAction?: VoidFunction;
  informationDialog?: boolean;
};

const initialState: AlertDialogState = {
  open: false,
  title: "Title",
  content: "Content",
  style: {},
  informationDialog: false,
  positiveAction: () => undefined,
  negativeAction: () => undefined
};

const AlertDialogContext = createContext<AlertDialogContextValue>({
  showDialog: () => undefined
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogProvider = ({ children }: AlertDialogProviderProps): JSX.Element => {
  const [dialogState, setDialogState] = useState(initialState);

  const showDialog = (
    { title, content, style = {}, informationDialog }: DialogConfig,
    positiveAction?: () => void,
    negativeAction?: () => void
  ): void => {
    setDialogState({
      ...dialogState,
      open: true,
      title,
      content,
      style,
      positiveAction,
      negativeAction,
      informationDialog
    });
  };

  const handleAction = (type: "positive" | "negative") => {
    if (type === "positive") {
      if (typeof dialogState.positiveAction === "function") {
        dialogState.positiveAction();
      }
    } else if (typeof dialogState.negativeAction === "function") {
      dialogState.negativeAction();
    }
    setDialogState({
      ...dialogState,
      open: false
    });
  };

  return (
    <AlertDialogContext.Provider value={{ showDialog }}>
      <Dialog
        open={dialogState.open}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{ sx: dialogState.style }}
        sx={dialogState.style}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{dialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div" id="alert-dialog-slide-description">
            {dialogState.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleAction("positive")}
            sx={{
              color: "success.dark",
              fontWeight: "fontWeightBold",
              fontSize: "1.25em"
            }}
          >
            {dialogState.informationDialog ? "Ok" : "Yes"}
          </Button>

          <Button
            onClick={() => handleAction("negative")}
            sx={{
              color: "error.dark",
              fontWeight: "fontWeightBold",
              fontSize: "1.25em",
              display: dialogState.informationDialog ? "none" : "initial"
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </AlertDialogContext.Provider>
  );
};

function useAlertDialog(): AlertDialogContextValue {
  const context = React.useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error("useAlertDialog must be used within a AlertDialogProvider");
  }
  return context;
}

export { AlertDialogProvider, useAlertDialog };

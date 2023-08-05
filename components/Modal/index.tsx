import IconButton from "@mui/material/IconButton";
import MuiModal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Fade from "./FadeAnimation";
import { SxProps } from "@mui/system";

/**
 * Chart Container prop types.
 * @typedef {Object} ModalProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {React.ReactNode} children the children of this component
 * @property {boolean} open if true, the modal will be shown, false otherwise
 * @property {boolean|undefined} closeIcon if true, a close icon will be shown on top right corner of the modal
 * @property {function} onClose function that will be called when the user
 * click the close icon
 * @property {string|undefined} title modal title
 * @property {boolean|undefined} disableEscape by default user can close the modal by hitting
 * escape button. To disable this behaviour set this props to true.
 * @property {string|undefined} testIdContext the context for data-testid attribute (for testing)
 */
export type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  closeIcon?: boolean;
  onClose: () => void;
  zIndex?: number;
  title?: string;
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  iconBtnTop?: number;
  iconBtnRight?: number;
  disableEscape?: boolean;
  testIdContext?: string;
  sx?: SxProps;
};

/**
 * Used to show pop up to user
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props ModalProps
 */
const Modal = ({
  children,
  open,
  sx = {},
  onClose,
  closeIcon,
  zIndex = 1299,
  minWidth = "80%",
  maxWidth = "90%",
  maxHeight = "85vh",
  iconBtnRight = 3,
  iconBtnTop = 3,
  title,
  disableEscape
}: ModalProps): JSX.Element => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      style={{ zIndex: zIndex }}
      disableEscapeKeyDown={disableEscape}
    >
      <Fade in={open}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          {closeIcon && (
            <IconButton
              sx={{
                position: "absolute",
                right: (theme) => theme.spacing(iconBtnRight),
                top: (theme) => theme.spacing(iconBtnTop),
                color: "whitesmoke"
              }}
              aria-label="close modal"
              component="span"
              onClick={onClose}
              size="large"
            >
              <CancelIcon fontSize="large" />
            </IconButton>
          )}
          <Paper
            sx={{
              minWidth: minWidth,
              maxWidth: maxWidth,
              maxHeight,
              position: "relative",
              py: 2,
              px: 3,
              overflowY: "auto",
              ...sx
            }}
          >
            {title && (
              <Typography component="h4" variant="h4" sx={{ textAlign: "center" }}>
                {title}
              </Typography>
            )}
            {children}
          </Paper>
        </Box>
      </Fade>
    </MuiModal>
  );
};

export default Modal;

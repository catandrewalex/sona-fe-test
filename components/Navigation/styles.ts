import { Theme } from "@mui/material";

export const drawerWidth = 240;

const styles = (theme: Theme) =>
  ({
    content: {
      // height: "calc(100vh - 24px)",
      pt: 4.5,
      px: 1.5,
      width: "100%",
      "& > *:last-child": {
        pb: 1.5
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar
    }
  } as const);

export default styles;

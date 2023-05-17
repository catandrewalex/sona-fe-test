import { Theme } from "@mui/material/styles";

export const drawerWidth = 300;

const styles = (theme: Theme) =>
  ({
    content: {
      p: 3,
      width: "100%",
      "& > *:last-child": {
        pb: 3
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

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import DrawerItem from "@sonamusica-fe/components/Navigation/DrawerItem";
import styles, { drawerWidth } from "./styles";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Image from "next/image";
import { getLocalStorage, setLocalStorage } from "@sonamusica-fe/utils/BrowserUtil";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme)
    })
  })
);

/**
 * Side navigation component (sidebar) that display list of navigation
 * item (@see DrawerItem)
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props PageContainerProps
 */
const SideBar = (): JSX.Element => {
  const { open, closeDrawer } = useApp((state) => ({
    open: state.drawerOpen,
    isDark: state.isDark,
    closeDrawer: state.closeDrawer
  }));
  const theme = useTheme();

  const saveScroll = (e: Event) => {
    const sidebarElement = e.target as HTMLElement;
    if (sidebarElement) {
      const position = sidebarElement.scrollTop;
      setLocalStorage("sidebar-pos", position.toString());
    }
  };

  useEffect(() => {
    const sidebarScrollPos = getLocalStorage("sidebar-pos");
    const sidebarElement = document.getElementById("sidebar");

    if (sidebarElement) {
      if (sidebarScrollPos) sidebarElement.scrollTop = parseInt(sidebarScrollPos);
      sidebarElement.addEventListener("scroll", saveScroll);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener("scroll", saveScroll);
      }
    };
  }, []);

  return (
    <Drawer PaperProps={{ id: "sidebar" }} variant="permanent" open={open}>
      <Box sx={styles(theme).toolbar}>
        <Button
          focusRipple={false}
          onClick={closeDrawer}
          className="no-text-transform"
          fullWidth
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <>
            <Image src="/favicon.ico" width="48" height="48" className="mr-2" alt="logo" />
            <Typography variant="subtitle1" component="h6">
              Sonamusica
            </Typography>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </>
        </Button>
      </Box>
      <Divider />
      <DrawerItem />
    </Drawer>
  );
};
export default SideBar;

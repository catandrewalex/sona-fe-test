import React, { useEffect } from "react";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import TopBar from "@sonamusica-fe/components/Navigation/TopBar";
import SideBar from "@sonamusica-fe/components/Navigation/SideBar";
import Loader from "@sonamusica-fe/components/Loader";
import Box from "@mui/material/Box";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";

/**
 * Navigation component prop types.
 * @typedef {Object} NavigationProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 * @property {string} [title=""] the page title that will appear on navigation bar
 */
type NavigationProps = {
  title?: string | undefined;
  children: JSX.Element | JSX.Element[];
};

/**
 * Container for navigation items. This includes sidebar component (@see SideBar) and topbar component (@see TopBar).
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props NavigationProps
 */
const Navigation = ({ title = "", children }: NavigationProps): JSX.Element => {
  const { loading, toggleDrawer } = useApp((state) => ({
    loading: state.isLoading,
    toggleDrawer: state.toggleDrawer
  }));
  const theme = useTheme();

  // handle keyboard shortcut
  const navShortcutHandler = (e: KeyboardEvent): void => {
    const code = e.key || e.code || e.keyCode;

    if (code == 27 || code == "Escape") {
      toggleDrawer();
    }
  };

  const resizeHandler = (): void => {
    const el = document.getElementById("main");
    if (el) {
      el.style.width = "99%";
      el.style.width = "100%";
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", navShortcutHandler);
    window.addEventListener("resize", resizeHandler);

    return () => {
      document.removeEventListener("keydown", navShortcutHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <Box className={loading ? "container flex-row" : "flex full-height"} sx={styles(theme).content}>
      <TopBar title={title} />
      <SideBar />
      <Box component="main" id="main" sx={styles(theme).content}>
        <Box sx={{ ...styles(theme).toolbar, minHeight: (theme) => theme.spacing(4) }} />
        {loading ? <Loader /> : children}
      </Box>
    </Box>
  );
};

export default Navigation;

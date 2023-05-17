import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import MenuList from "@sonamusica-fe/components/Profile/MenuList";
import Profile from "@sonamusica-fe/components/Profile";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import API from "@sonamusica-fe/api";
import { drawerWidth } from "./styles";
import { styled, useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

/**
 * TopBar component prop types.
 * @typedef {Object} TopBarProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {string} [title] the page title that will appear on top
 */
type TopBarProps = {
  title: string;
};

/**
 * Top navigation component (topbar) that display logo, hamburger icon,
 * signin button (or user profile), and other utilities.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props TopBarProps
 */
const TopBar = ({ title }: TopBarProps): JSX.Element => {
  const {
    open: drawerOpen,
    openDrawer,
    isDark,
    toggleDarkMode
  } = useApp((state) => ({
    open: state.drawerOpen,
    openDrawer: state.openDrawer,
    isDark: state.isDark,
    toggleDarkMode: state.toggleDarkMode
  }));
  const { user, logout } = useUser((state) => ({ user: state.user, logout: state.logout }));
  const { showSnackbar } = useSnack();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & Element) | null>(null);

  const handleOpen = (event: React.SyntheticEvent): void => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    showSnackbar("Logout success!", "success");
    logout();
    setAnchorEl(null);
  };

  return (
    <AppBar color="primary" elevation={3} position="fixed" open={drawerOpen}>
      <Toolbar color="inherit" sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            edge="start"
            className={drawerOpen ? "hide" : ""}
            sx={{
              mr: theme.spacing(1),
              pl: theme.spacing(1)
            }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap data-testid="Topbar-PageTitleTxt">
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={isDark ? "Turn Off Dark Mode" : "Turn On Dark Mode"}>
            <IconButton sx={{ mr: 2 }} onClick={toggleDarkMode} color="secondary">
              {isDark ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          {user != undefined && <Profile handleOpen={handleOpen} open={open} />}
          <MenuList open={open} anchorEl={anchorEl} onClose={handleClose} onLogout={handleLogout} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;

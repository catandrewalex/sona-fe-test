import React from "react";
import {
  createTheme,
  Theme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  PaletteOptions
} from "@mui/material/styles";
import { useApp } from "./AppProvider";
import CssBaseline from "@mui/material/CssBaseline";

// declare module "@mui/styles/defaultTheme" {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

/**
 * Theme provider prop types.
 * @typedef {Object} ThemeProviderProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 */
type ThemeProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const darkPalette: PaletteOptions = {
  mode: "dark"
  // primary: {
  //   main: "#3BBB02"
  // }
};

const lightPalette: PaletteOptions = {
  mode: "light"
  // primary: {
  //   main: "#06a522",
  //   light: "#3BBB02",
  //   dark: "#1AAA02",
  //   contrastText: "#E5E5E5"
  // },
  // secondary: {
  //   main: "#D4D158",
  //   light: "#D3D058",
  //   dark: "#D1D058",
  //   contrastText: "#E5E5E5"
  // },
  // error: {
  //   light: "#FF3E3E",
  //   dark: "#D32F2F",
  //   contrastText: "#E5E5E5",
  //   main: "#F44336"
  // }
};

const typography = {};

const components = {
  MuiCssBaseline: {
    styleOverrides: {
      "@global": {
        "*": {
          scrollbarWidth: "thin"
        },
        "*::-webkit-scrollbar": {
          width: "0.3em"
        },
        "*::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          outline: "5px solid slategrey",
          borderRadius: "20px"
        }
      }
    }
  }
};

const mixins = {
  toolbar: {
    minHeight: "64px"
  }
};

/**
 * Configuration for light theme
 * @link https://material-ui.com/customization/default-theme/
 */
const lightTheme: Theme = createTheme({
  palette: lightPalette,
  typography,
  mixins,
  components
});

/**
 * Configuration for dark theme
 * @link https://material-ui.com/customization/default-theme/
 */
const darkTheme: Theme = createTheme({
  palette: darkPalette,
  typography,
  mixins,
  components
});

/**
 * Provide global theme component that used Material UI theme provider component (https://material-ui.com/customization/theming/).
 * @link http://172.21.56.255:3333/
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props ThemeProviderProps
 */
const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const { isDark } = useApp((state) => ({
    isDark: state.isDark
  }));
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTheme = (dark?: boolean) => {
  if (dark) return darkTheme;
  else return lightTheme;
};
export default ThemeProvider;

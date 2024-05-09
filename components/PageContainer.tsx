import React, { useEffect } from "react";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import Loader from "@sonamusica-fe/components/Loader";
import PageInfo from "@sonamusica-fe/components/PageInfo";
import LoginForm from "@sonamusica-fe/components/LoginForm";
import { getCookie, getLocalStorage } from "@sonamusica-fe/utils/BrowserUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { User } from "@sonamusica-fe/types";
import Navigation from "@sonamusica-fe/components/Navigation";
import Error403 from "@sonamusica-fe/components/Error/Error403";
import { CSSProperties } from "styled-components";

import { styled, Paper, Box } from "@mui/material";

const LoginContainer = styled(Paper)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper
}));

/**
 * PageContainer component prop types.
 * @typedef {Object} PageContainerProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 * @property {string} [pageTitle] the page title (in <head>)
 * @property {string} [pageDescription] the page description (in <meta>)
 * @property {(JSX.Element|JSX.Element[])} [headElement] elements that will be put on <head> element
 * @property {string} [navTitle] the page title that will appear on navigation bar
 */
type PageContainerProps = {
  children: JSX.Element | Array<JSX.Element>;
  pageTitle?: string | undefined;
  pageDescription?: string | undefined;
  headElement?: JSX.Element | JSX.Element[];
  navTitle?: string | undefined;
  noNavigation?: boolean;
  page?: string | undefined;
  notFound?: boolean;
  noAuth?: boolean;
  isAuthorized?: (user?: User) => boolean;
  sx?: CSSProperties;
};

/**
 * Container for all pages that includes: top navigation, side navigation,
 * and loading screen. This will also handle global configuration
 * that will be load once for example: loading user data from
 * cookies and changing dark mode setting from local storage.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props PageContainerProps
 */
const PageContainer = ({
  children,
  pageTitle,
  pageDescription,
  headElement,
  navTitle,
  noAuth,
  isAuthorized,
  sx
}: PageContainerProps): JSX.Element => {
  const { isAppLoading, closeDrawer, openDrawer, turnOnDark, turnOffDark } = useApp((state) => ({
    isAppLoading: state.isAppLoading,
    closeDrawer: state.closeDrawer,
    openDrawer: state.openDrawer,
    turnOnDark: state.turnOnDarkMode,
    turnOffDark: state.turnOffDarkMode
  }));

  const apiTransformer = useApiTransformer();

  const { user, setUser } = useUser((state) => ({
    user: state.user,
    setUser: state.setUser
  }));

  useEffect(() => {
    if (isAppLoading) {
      // load the user information from cookie (if available)
      const authToken = getCookie("SNMC");
      const userId = getCookie("SNMC_ID");

      if (authToken && userId) {
        API.GetUserProfile().then((response) => {
          const loggedInUser = apiTransformer(response, false) as User;
          setUser(loggedInUser);
        });
      }

      // restore the previous state of side navigation drawer
      const drawerState = getLocalStorage("drawer");
      if (drawerState == null) {
        // if the user visit the site for the first time
        // set side navigation drawer state from the device type
        const isTabletOrMobile = window.matchMedia("(max-width: 960px)").matches;
        if (isTabletOrMobile) closeDrawer();
      } else {
        if (drawerState != undefined && drawerState != "") {
          if (drawerState == "true") openDrawer();
          else closeDrawer();
        }
      }

      // restore the previous state of dark theme mode
      const darkThemeState = getLocalStorage("dark");
      if (darkThemeState !== undefined && darkThemeState !== null && darkThemeState !== "") {
        if (darkThemeState === "true") {
          turnOnDark();
        } else turnOffDark();
      }
    }
  }, []);

  if (isAppLoading) {
    return <Loader animation testIdContext="App" />;
  }

  let content = undefined;

  if (noAuth) {
    content = children;
  } else {
    if (isAuthorized && !isAuthorized(user)) {
      content = (
        <Navigation title={navTitle}>
          <Error403 />
        </Navigation>
      );
    } else {
      if (!user) {
        return (
          <LoginContainer data-testid="LoginPageContainer">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <LoginForm />
            </Box>
          </LoginContainer>
        );
      } else {
        content = <Navigation title={navTitle}>{children}</Navigation>;
      }
    }
  }

  return (
    <Box sx={sx} className="container" data-testid={navTitle} style={{ height: "100vh" }}>
      <PageInfo title={pageTitle} description={pageDescription}>
        {headElement}
      </PageInfo>
      {content}
    </Box>
  );
};

export default PageContainer;

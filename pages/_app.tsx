import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import Providers from "@sonamusica-fe/providers/index";
import "../styles/globals.scss";
import { Paper, Chip } from "@mui/material";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sonamusica</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Providers>
        <Paper elevation={0} square id="app" style={{ overflowY: "auto" }}>
          {process.env.ENVIRONMENT !== "production" && (
            <Chip
              color="error"
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                borderRadius: 0,
                borderBottomLeftRadius: 5,
                zIndex: 9999
              }}
              label="BETA"
              size="small"
            />
          )}
          <Component {...pageProps} />
        </Paper>
      </Providers>
    </>
  );
};

export default MyApp;

import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import Image from "next/image";

export default function Home(): JSX.Element {
  const finishLoading = useApp((state) => state.finishLoading);
  useEffect(() => finishLoading(), []);

  const user = useUser((state) => state.user);

  return (
    <PageContainer pageTitle="Sonamusica" navTitle="Home">
      <div style={{ textAlign: "center" }}>
        <Typography paragraph>Hi {user?.email}, Welcome!</Typography>
        <Image src="/logo.png" width="500" height="287" />
        <h1 className="hero__title">Sonamusica</h1>
        <p>Testing</p>
      </div>
    </PageContainer>
  );
}

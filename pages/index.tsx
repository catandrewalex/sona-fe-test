import { useEffect } from "react";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import Image from "next/image";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { Divider, Typography } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeMenuStaffAbove from "@sonamusica-fe/pages/home-menu-staff-above";
import HomeMenuMember from "@sonamusica-fe/pages/home-menu-member";

export default function Home(): JSX.Element {
  const finishLoading = useApp((state) => state.finishLoading);
  useEffect(() => finishLoading(), []);

  const user = useUser((state) => state.user);

  return (
    <PageContainer pageTitle="Sonamusica" navTitle="Home">
      <div style={{ textAlign: "center" }}>
        <Image unoptimized src="/logo.png" width="350" height="200" />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Hi {getFullNameFromUser(user)}, Welcome!
        </Typography>
      </div>
      <Divider sx={{ my: 2, mb: 3 }} />
      <HomeMenuMember />
      <>{user && user?.privilegeType >= UserType.STAFF && <HomeMenuStaffAbove />}</>
    </PageContainer>
  );
}

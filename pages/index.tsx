import { useEffect } from "react";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import Image from "next/image";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { Box, Divider, Typography } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeMenuStaffAbove from "@sonamusica-fe/components/Pages/Home/Actions/home-menu-staff-above";
import HomeMenuMember from "@sonamusica-fe/components/Pages/Home/Actions/home-menu-member";
import Grid2 from "@mui/material/Unstable_Grid2";

export default function Home(): JSX.Element {
  const finishLoading = useApp((state) => state.finishLoading);
  useEffect(() => finishLoading(), []);

  const user = useUser((state) => state.user);

  return (
    <PageContainer pageTitle="Sonamusica" navTitle="Home">
      <Box sx={{ textAlign: "center" }}>
        <Image unoptimized src="/logo.png" width="350" height="200" />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Hi {getFullNameFromUser(user)}, Welcome!
        </Typography>
      </Box>
      <Divider sx={{ my: 2, mb: 3 }} />

      <Grid2 container spacing={3}>
        <Grid2 md={6}>
          <Typography variant="h5">Actions</Typography>
          <HomeMenuMember />
          <>{user && user?.privilegeType >= UserType.STAFF && <HomeMenuStaffAbove />}</>
        </Grid2>
        <Grid2 md={6}>
          <Typography variant="h5">Statistic</Typography>
        </Grid2>
      </Grid2>
    </PageContainer>
  );
}

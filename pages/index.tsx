import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import Image from "next/image";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { Button, Card, CardActions, CardContent, CardHeader, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { Add, ArrowRight } from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home(): JSX.Element {
  const finishLoading = useApp((state) => state.finishLoading);
  useEffect(() => finishLoading(), []);
  const { push } = useRouter();

  const user = useUser((state) => state.user);

  useEffect(() => AOS.init({ delay: 250, duration: 750 }), []);

  return (
    <PageContainer pageTitle="Sonamusica" navTitle="Home">
      <div style={{ textAlign: "center" }}>
        <Image src="/logo.png" width="350" height="200" />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Hi {getFullNameFromUser(user)}, Welcome!
        </Typography>
      </div>
      <Divider sx={{ my: 2, mb: 3 }} />
      <Card elevation={4} sx={{ pl: 2 }} data-aos="fade-up">
        <CardHeader title="Enrollment Payment" />
        <CardContent>
          <Typography>
            Manage student enrollment payments, such as: top up balance and update payment date.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            endIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={() => push("/payment/new")}
          >
            Add New Payment
          </Button>
          <Button endIcon={<ArrowRight />} variant="outlined" color="secondary">
            Manage Enrollment Payment
          </Button>
        </CardActions>
      </Card>
    </PageContainer>
  );
}

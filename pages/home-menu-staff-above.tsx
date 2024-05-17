import { Add, ArrowRight } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { useRouter } from "next/router";

const HomeMenuStaffAbove = (): JSX.Element => {
  const { push } = useRouter();
  return (
    <>
      <Card elevation={4} sx={{ pl: 2, pb: 2 }}>
        <CardHeader title="Enrollment Payment" />
        <CardContent>
          <Typography>
            Manage student enrollment payments: add new student payment, search existing payments,
            and update/delete enrollment payment records.
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
          <Button
            onClick={() => push("/payment")}
            endIcon={<ArrowRight />}
            variant="outlined"
            color="secondary"
          >
            Manage Enrollment Payment
          </Button>
        </CardActions>
      </Card>

      <Card elevation={4} sx={{ mt: 4, pl: 2, pb: 2 }}>
        <CardHeader title="Attendance" />
        <CardContent>
          <Typography>
            Manage student attendances: add new attendance, search existing attendance, and
            update/delete attendance records.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => push("/attendance")}
            endIcon={<ArrowRight />}
            variant="contained"
            color="primary"
          >
            Manage Attendance
          </Button>
        </CardActions>
      </Card>

      <Card elevation={4} sx={{ mt: 4, mb: 8, pl: 2, pb: 2 }}>
        <CardHeader title="Teacher Payment" />
        <CardContent>
          <Typography>
            Manage teacher payments: add new teacher payment, search existing payments, and
            update/delete teacher payment records.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            endIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={() => push("/teacher-payment")}
          >
            Add New Teacher Payment
          </Button>
          <Button
            onClick={() => push("/teacher-payment/edit")}
            endIcon={<ArrowRight />}
            variant="outlined"
            color="secondary"
          >
            Edit Teacher Payment
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default HomeMenuStaffAbove;

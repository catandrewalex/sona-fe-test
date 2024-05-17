import { ArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import LoaderSimple from "@sonamusica-fe/components/LoaderSimple";
import { useUser } from "@sonamusica-fe/providers/AppProvider";
import { UserTeachingInfo } from "@sonamusica-fe/types";
import { FailedResponse } from "api";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { useEffect, useState } from "react";

const HomeMenuMember = (): JSX.Element => {
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const [loading, setLoading] = useState<boolean>(false);
  const [userTeachingInfo, setUserTeachingInfo] = useState<UserTeachingInfo>();
  const { push } = useRouter();

  useEffect(() => {
    setLoading(true);
    API.GetUserTeachingInfo()
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setUserTeachingInfo(parsedResponse as UserTeachingInfo);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  return (
    <>
      {loading ? (
        <LoaderSimple />
      ) : (
        (userTeachingInfo?.isStudent || userTeachingInfo?.isTeacher) && (
          <>
            {userTeachingInfo.isStudent && (
              <Card elevation={4} sx={{ pl: 2, pb: 2 }}>
                <CardHeader title="My Attendance" />
                <CardContent>
                  <Typography>
                    Manage my attendance: add, edit, and delete my attendance.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      const queryObj: ParsedUrlQueryInput = {
                        student: userTeachingInfo.studentId
                      };
                      push({ pathname: "/attendance", query: queryObj });
                    }}
                    endIcon={<ArrowRight />}
                    variant="contained"
                    color="primary"
                  >
                    Manage My Attendance
                  </Button>
                </CardActions>
              </Card>
            )}

            {userTeachingInfo.isTeacher && (
              <Card
                elevation={4}
                // we need extra margin top, if students card (above) exists
                sx={userTeachingInfo.isStudent ? { mt: 4, pl: 2, pb: 2 } : { pl: 2, pb: 2 }}
              >
                <CardHeader title="Students Attendance" />
                <CardContent>
                  <Typography>
                    Manage students attendance: add, edit, and delete students attendance.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      const queryObj: ParsedUrlQueryInput = {
                        teacher: userTeachingInfo.teacherId
                      };
                      push({ pathname: "/attendance", query: queryObj });
                    }}
                    endIcon={<ArrowRight />}
                    variant="contained"
                    color="primary"
                  >
                    Manage Students Attendance
                  </Button>
                </CardActions>
              </Card>
            )}
            <Divider sx={{ my: 4, mb: 7 }} />
          </>
        )
      )}
    </>
  );
};

export default HomeMenuMember;

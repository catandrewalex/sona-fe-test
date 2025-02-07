import { ArrowBack } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { TeacherPaymentUnpaidListItem } from "@sonamusica-fe/types";
import { getFullClassName, getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import NextLink from "next/link";

interface SearchResultTeacherPaymentProps {
  data: TeacherPaymentUnpaidListItem[];
  isEdit?: boolean;
}

const SearchResultTeacherPayment = ({
  data,
  isEdit
}: SearchResultTeacherPaymentProps): JSX.Element => {
  const { push, replace, query } = useRouter();

  const handleBackAction = useCallback(() => {
    replace({ query: undefined });
  }, [replace]);

  const onCardClick = useCallback(
    (teacherId: number) => {
      return () =>
        push({
          pathname: (isEdit ? "/teacher-payment/edit/" : "/teacher-payment/") + teacherId,
          query
        });
    },
    [isEdit, push, query]
  );

  return (
    <>
      <Button
        onClick={handleBackAction}
        color="error"
        sx={{ mt: 2 }}
        variant="outlined"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Box sx={{ mt: 2, p: 2, height: "calc(100vh - 200px)", overflowY: "auto" }}>
        <Masonry spacing={3} columns={{ md: 2, lg: 4 }}>
          {data.map((teacherPayment) => (
            <Card
              key={teacherPayment.teacherId}
              elevation={3}
              sx={{
                cursor: teacherPayment.totalAttendancesWithoutToken > 0 ? "not-allowed" : "pointer",
                backgroundColor:
                  teacherPayment.totalAttendancesWithoutToken > 0
                    ? "rgb(224 181 120 / 20%) !important"
                    : undefined
              }}
              onClick={
                teacherPayment.totalAttendancesWithoutToken > 0
                  ? undefined
                  : onCardClick(teacherPayment.teacherId)
              }
            >
              <CardHeader
                title={getFullNameFromUser(teacherPayment.user)}
                sx={{ py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
                titleTypographyProps={{ variant: "h6" }}
                subheader={`Username: ${teacherPayment.user.username || "-"}`}
                subheaderTypographyProps={{ variant: "caption" }}
              />
              <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                <Stack direction="column">
                  <Stack direction="row" spacing={1}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="300"
                      component="span"
                      width={isEdit ? 80 : 130}
                    >
                      {isEdit ? "Paid" : "Unpaid"} Attendances
                    </Typography>

                    <Typography variant="subtitle2" component="span">
                      :
                    </Typography>
                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                      {teacherPayment.totalAttendances}
                    </Typography>
                  </Stack>
                  {teacherPayment.totalAttendancesWithoutToken > 0 && (
                    <>
                      <Stack direction="row" spacing={1}>
                        <Typography
                          color="error"
                          variant="subtitle2"
                          fontWeight="300"
                          component="span"
                          width={130}
                        >
                          Unassigned Token
                        </Typography>
                        <Typography color="error" variant="subtitle2" component="span">
                          :
                        </Typography>
                        <Typography
                          color="error"
                          variant="subtitle2"
                          component="span"
                          fontWeight="bold"
                        >
                          {teacherPayment.totalAttendancesWithoutToken}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 0.5 }} />
                      <Typography
                        color="error"
                        variant="subtitle2"
                        fontWeight="bold"
                        align="center"
                        fontSize="small"
                      >
                        Please assign the tokens on the classes below
                      </Typography>
                      <ul style={{ margin: 0, padding: 0, paddingLeft: 16 }}>
                        {teacherPayment.classesNeedTokenAssignment.map((cls) => (
                          <li key={cls.classId}>
                            <Link href={`/attendance/${cls.classId}`} component={NextLink}>
                              <Typography
                                variant="subtitle2"
                                fontSize={12}
                                fontWeight="300"
                                sx={{
                                  textDecoration: "underline",
                                  ":hover": {
                                    cursor: "pointer",
                                    color: (theme) => theme.palette.info.main
                                  }
                                }}
                              >
                                {getFullClassName(cls)}
                              </Typography>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      </Box>
    </>
  );
};

export default SearchResultTeacherPayment;

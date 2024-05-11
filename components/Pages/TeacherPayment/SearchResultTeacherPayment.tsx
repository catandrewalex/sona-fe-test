import { ArrowBack } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { TeacherPaymentUnpaidListItem } from "@sonamusica-fe/types";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

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
    [push, query]
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
        <Masonry spacing={3} columns={{ md: 3, xl: 5, lg: 4 }}>
          {data.map((teacherPayment) => (
            <Card
              key={teacherPayment.teacherId}
              elevation={3}
              sx={{ cursor: "pointer" }}
              onClick={onCardClick(teacherPayment.teacherId)}
            >
              <CardHeader
                title={getFullNameFromUser(teacherPayment.user)}
                sx={{ py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
                titleTypographyProps={{ variant: "h6" }}
                subheader={`Username: ${teacherPayment.user.username || "-"}`}
                subheaderTypographyProps={{ variant: "caption" }}
              />
              <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                <Typography variant="subtitle2" fontWeight="300" component="span">
                  {isEdit ? "Paid" : "Unpaid"} Attendances:
                </Typography>
                <Typography variant="subtitle2" component="span" fontWeight="bold" sx={{ ml: 1 }}>
                  {teacherPayment.totalAttendances}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      </Box>
    </>
  );
};

export default SearchResultTeacherPayment;

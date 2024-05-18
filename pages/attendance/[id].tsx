import { Refresh } from "@mui/icons-material";
import { Alert, Button, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import AttendanceDetailContainer from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Class, UserTeachingInfo, UserType } from "@sonamusica-fe/types";
import { isValidNumericString } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const AttendanceDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const user = useUser((state) => state.user);
  const [classData, setClassData] = useState<Class>();
  const [userTeachingInfo, setUserTeachingInfo] = useState<UserTeachingInfo>();
  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));
  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  const fetchClassData = useCallback(() => {
    const id = query.id;
    if (isValidNumericString(id)) {
      startLoading();
      API.GetClassById(parseInt(id as string))
        .then((response) => {
          const parsedClassData = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedClassData) !== FailedResponse.prototype) {
            setClassData(parsedClassData as Class);
          } else {
            showSnackbar("Failed to fetch class data!", "error");
          }
        })
        .finally(finishLoading);
    }
  }, [query]);

  useEffect(() => {
    API.GetUserTeachingInfo().then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        setUserTeachingInfo(parsedResponse as UserTeachingInfo);
      }
    });
    // TODO(FerdiantJoshua): connect with loading, just like fetchClassData? so that the page only renders after all endpoint has been properly fetched.
    // Currently, this API is lighter than fetchClassData, so in most cases it should return much earlier than fetchClassData.
  }, []);

  useEffect(fetchClassData, [query]);

  const isUserHasWriteAccess =
    user !== undefined &&
    (user.privilegeType >= UserType.STAFF ||
      (userTeachingInfo !== undefined &&
        userTeachingInfo.teacherId === classData?.teacher?.teacherId));

  return (
    <PageContainer navTitle="Attendance Detail" pageTitle="Attendance Detail">
      {classData ? (
        <AttendanceDetailContainer
          classData={classData}
          isUserHasWriteAccess={isUserHasWriteAccess}
        />
      ) : (
        <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
          <Typography component="span">Failed to load class data!</Typography>
          <Button
            startIcon={<Refresh />}
            sx={{ ml: 2 }}
            variant="contained"
            color="info"
            onClick={fetchClassData}
          >
            Refresh
          </Button>
        </Alert>
      )}
    </PageContainer>
  );
};

export default AttendanceDetailPage;

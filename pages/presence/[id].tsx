import { Refresh } from "@mui/icons-material";
import { Alert, Button, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import PresenceDetailContainer from "@sonamusica-fe/components/Pages/Presence/PresenceDetail";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Class } from "@sonamusica-fe/types";
import { isValidNumericString } from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse } from "api";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const PresenceDetailPage = (): JSX.Element => {
  const [classData, setClassData] = useState<Class>();
  const { query } = useRouter();
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

  useEffect(fetchClassData, [query]);

  return (
    <PageContainer navTitle="Presence Detail" pageTitle="Presence Detail">
      {classData ? (
        <PresenceDetailContainer classData={classData} />
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

export default PresenceDetailPage;

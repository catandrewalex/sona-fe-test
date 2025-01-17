import React, { useState, useEffect } from "react";
import { Container, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StatusManagementSection } from "@sonamusica-fe/components/Pages/Class/StatusUpdate/StatusManagementSection";
import { CourseUpdateSection } from "@sonamusica-fe/components/Pages/Class/CourseUpdate/CourseUpdateSection";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Course } from "@sonamusica-fe/types";
import { FailedResponse, ResponseMany } from "api";
import useClassFetch from "@sonamusica-fe/components/Pages/Class/useClassFetch";

const ITEMS_PER_PAGE = 10;

// TODO: replace these AI-generated components with our FE components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  "& > *": {
    marginBottom: theme.spacing(3)
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  "& .section-title": {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `2px solid ${theme.palette.divider}`
  }
}));

export const BatchClassUpdatePageComponent = (): JSX.Element => {
  // State management
  const { showSnackbar } = useSnack();
  const apiTransformer = useApiTransformer();

  const [courseData, setCourseData] = useState<Course[]>([]);
  const {
    data: classData,
    error: errorClass,
    isLoading: loading,
    refetch: refetchClass
  } = useClassFetch();

  useEffect(() => {
    if (errorClass) showSnackbar(errorClass, "error");
  }, [errorClass, showSnackbar]);

  useEffect(() => {
    API.GetCourseDropdownOptions()
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
          setCourseData((parsedResponse as ResponseMany<Course>).results);
      })
      .catch(() => {
        showSnackbar("Failed to fetch courses data!", "error");
      });
  }, [showSnackbar]);

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper elevation={1}>
        <Typography variant="h5" className="section-title">
          Status Management
        </Typography>
        <StatusManagementSection
          classData={classData}
          itemsPerPage={ITEMS_PER_PAGE}
          dataLoading={loading}
          refetchClass={refetchClass}
        />
      </StyledPaper>

      <StyledPaper elevation={1}>
        <Typography variant="h5" className="section-title">
          Course Updates
        </Typography>
        <CourseUpdateSection
          classData={classData}
          courseData={courseData}
          itemsPerPage={ITEMS_PER_PAGE}
          dataLoading={loading}
          refetchClass={refetchClass}
        />
      </StyledPaper>
    </StyledContainer>
  );
};

export default BatchClassUpdatePageComponent;

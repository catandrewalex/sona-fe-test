// components/BatchClass/CourseChangesPreview.tsx

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CourseChangeMap } from "@sonamusica-fe/components/Pages/Class/types";
import { getMinimalClassName } from "@sonamusica-fe/utils/StringUtil";
import { Class } from "@sonamusica-fe/types";

interface CourseChangesPreviewProps {
  courseChanges: CourseChangeMap;
  classes: Class[];
  onRemoveChange: (classId: number) => void;
}

// TODO: replace these AI-generated components with our FE components
const PreviewContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2)
}));

const PreviewHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1.5)
}));

const ChangeItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  "&:last-child": {
    marginBottom: 0
  }
}));

const ChangeInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  flexDirection: "column",
  marginRight: theme.spacing(2)
}));

const CourseChange = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(0.5)
}));

const OldCourse = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  textDecoration: "line-through",
  marginRight: theme.spacing(1)
}));

const NewCourse = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 500
}));

const Arrow = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: theme.spacing(0, 1)
}));

// const DeleteButton = styled(IconButton)(({ theme }) => ({
//   padding: theme.spacing(0.5),
//   color: theme.palette.error.main,
//   "&:hover": {
//     backgroundColor: theme.palette.error.light,
//     color: theme.palette.error.dark
//   }
// }));

const NoChangesMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  textAlign: "center"
}));

export const CourseChangesPreview = ({
  courseChanges,
  classes,
  onRemoveChange
}: CourseChangesPreviewProps): JSX.Element => {
  const getDisplayName = (classId: number): string => {
    const classItem = classes.find((c) => c.classId === classId);
    if (!classItem) return "Unknown Class";

    return getMinimalClassName(classItem);
  };

  const getCurrentCourseName = (classId: number): string => {
    const classItem = classes.find((c) => c.classId === classId);
    if (!classItem) return "Unknown Course";
    return `${classItem.course.instrument.name} - ${classItem.course.grade.name}`;
  };

  return (
    <PreviewContainer elevation={0}>
      <PreviewHeader>
        <Typography variant="subtitle2">Pending Course Changes:</Typography>
      </PreviewHeader>

      {courseChanges.size > 0 ? (
        Array.from(courseChanges.values()).map((change) => (
          <ChangeItem key={change.classId} elevation={1}>
            <ChangeInfo>
              <Typography variant="body2">{getDisplayName(change.classId)}</Typography>
              <CourseChange>
                <OldCourse variant="caption">{getCurrentCourseName(change.classId)}</OldCourse>
                <Arrow variant="caption">→</Arrow>
                <NewCourse variant="caption">{change.newCourseName}</NewCourse>
              </CourseChange>
            </ChangeInfo>

            <Button
              variant="contained"
              color="error"
              size="small"
              aria-label="Remove change"
              onClick={() => onRemoveChange(change.classId)}
            >
              Remove
            </Button>

            {/* <DeleteButton onClick={() => onRemoveChange(change.classId)} aria-label="Remove change">
              <DeleteIcon />
            </DeleteButton> */}
          </ChangeItem>
        ))
      ) : (
        <NoChangesMessage variant="body2">No pending course changes</NoChangesMessage>
      )}
    </PreviewContainer>
  );
};

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { StatusChangeMap } from "@sonamusica-fe/components/Pages/Class/types";
import { getMinimalClassName } from "@sonamusica-fe/utils/StringUtil";
import { Class } from "@sonamusica-fe/types";

interface StatusChangesPreviewProps {
  statusChanges: StatusChangeMap;
  autoOweTokenChanges: StatusChangeMap;
  classes: Class[];
}

// TODO: replace these AI-generated components with our FE components
const PreviewContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

const PreviewSection = styled(Paper)(({ theme }) => ({
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
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  "&:last-child": {
    marginBottom: 0
  }
}));

const ChangeState = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  marginLeft: theme.spacing(1)
}));

const OldState = styled(Typography)<{ color?: string }>(({ theme, color }) => ({
  color: color || theme.palette.error.main,
  textDecoration: "line-through",
  marginRight: theme.spacing(1)
}));

const NewState = styled(Typography)<{ color?: string }>(({ theme, color }) => ({
  color: color || theme.palette.success.main,
  fontWeight: 500
}));

const Arrow = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: theme.spacing(0, 1)
}));

interface ChangeItemProps {
  displayName: string;
  oldState: string;
  newState: string;
  oldStateColor?: string;
  newStateColor?: string;
}

const ChangeItemComponent = ({
  displayName,
  oldState,
  newState,
  oldStateColor,
  newStateColor
}: ChangeItemProps): JSX.Element => (
  <ChangeItem elevation={1}>
    <Box display="flex" flexDirection="column">
      <Typography variant="body2">{displayName}</Typography>
      <ChangeState>
        <OldState variant="body2" color={oldStateColor}>
          {oldState}
        </OldState>
        <Arrow variant="body2">→</Arrow>
        <NewState variant="body2" color={newStateColor}>
          {newState}
        </NewState>
      </ChangeState>
    </Box>
  </ChangeItem>
);

export const StatusChangesPreview = ({
  statusChanges,
  autoOweTokenChanges,
  classes
}: StatusChangesPreviewProps): JSX.Element => {
  const getDisplayName = (classId: number): string => {
    const classItem = classes.find((c) => c.classId === classId);
    if (!classItem) return "Unknown Class";

    return getMinimalClassName(classItem);
  };

  return (
    <PreviewContainer>
      <PreviewSection elevation={0}>
        <PreviewHeader>
          <Typography variant="subtitle2">Pending Status Changes:</Typography>
        </PreviewHeader>
        {Array.from(statusChanges.values()).length > 0 ? (
          Array.from(statusChanges.values()).map((change) => (
            <ChangeItemComponent
              key={change.classId}
              displayName={getDisplayName(change.classId)}
              oldState={change.newValue ? "Active" : "Inactive"}
              newState={change.newValue ? "Inactive" : "Active"}
              oldStateColor={change.newValue ? "#2e7d32" : "#d32f2f"}
              newStateColor={change.newValue ? "#d32f2f" : "#2e7d32"}
            />
          ))
        ) : (
          <ChangeItem>
            <Typography variant="body2" color="textSecondary">
              No pending status changes
            </Typography>
          </ChangeItem>
        )}
      </PreviewSection>

      <PreviewSection elevation={0}>
        <PreviewHeader>
          <Typography variant="subtitle2">Pending Auto-Owe Token Changes:</Typography>
        </PreviewHeader>
        {Array.from(autoOweTokenChanges.values()).length > 0 ? (
          Array.from(autoOweTokenChanges.values()).map((change) => (
            <ChangeItemComponent
              key={change.classId}
              displayName={getDisplayName(change.classId)}
              oldState={change.newValue ? "Disabled" : "Enabled"}
              newState={change.newValue ? "Enabled" : "Disabled"}
              oldStateColor={change.newValue ? "#d32f2f" : "#2e7d32"}
              newStateColor={change.newValue ? "#2e7d32" : "#d32f2f"}
            />
          ))
        ) : (
          <ChangeItem>
            <Typography variant="body2" color="textSecondary">
              No pending auto-owe token changes
            </Typography>
          </ChangeItem>
        )}
      </PreviewSection>
    </PreviewContainer>
  );
};

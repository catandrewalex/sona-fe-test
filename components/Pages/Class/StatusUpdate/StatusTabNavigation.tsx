import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TabType } from "@sonamusica-fe/components/Pages/Class/types";

interface StatusTabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// TODO: replace these AI-generated components with our FE components
const TabContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "1px",
  backgroundColor: theme.palette.grey[100],
  padding: 2,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2)
}));

const TabButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive"
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  flex: 1,
  padding: theme.spacing(1, 2),
  backgroundColor: isActive ? theme.palette.primary.main : "transparent",
  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius - 1,
  "&:hover": {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover
  },
  textTransform: "none" // Keeps original text case
}));

const tabConfig: { id: TabType; label: string }[] = [
  { id: "status", label: "Active/Inactive" },
  { id: "token", label: "Auto-Owe Token" }
];

export const StatusTabNavigation = ({
  currentTab,
  onTabChange
}: StatusTabNavigationProps): JSX.Element => {
  return (
    <TabContainer>
      {tabConfig.map(({ id, label }) => (
        <TabButton
          key={id}
          isActive={currentTab === id}
          onClick={() => onTabChange(id)}
          disableElevation
        >
          {label}
        </TabButton>
      ))}
    </TabContainer>
  );
};

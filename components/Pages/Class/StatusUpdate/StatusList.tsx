import React, { useCallback, useMemo } from "react";
import { Box, Typography, Paper, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { StatusChangeMap } from "@sonamusica-fe/components/Pages/Class/types";
import { getCourseName, getMinimalClassName } from "@sonamusica-fe/utils/StringUtil";
import { Class, PaginationState } from "@sonamusica-fe/types";
import Pagination from "@sonamusica-fe/components/Pagination";

interface StatusListProps {
  title: string;
  classData: Class[];
  property: "isDeactivated" | "autoOweAttendanceToken";
  changeMap: StatusChangeMap;
  paginationState: PaginationState;
  onPaginationChange: (page: number) => void;
  onStatusChange: (classId: number, property: "isDeactivated" | "autoOweAttendanceToken") => void;
  itemsPerPage: number;
}

// TODO: replace these AI-generated components with our FE components
const ListContainer = styled(Box)(({ theme }) => ({
  height: "450px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

const ModifiedBadge = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(0.25, 1),
  borderRadius: 12,
  fontSize: "0.75rem",
  backgroundColor: "#fff3e0",
  color: "#f57c00",
  marginLeft: theme.spacing(1)
}));

export const StatusList = ({
  title,
  classData,
  property,
  changeMap,
  paginationState,
  onPaginationChange,
  onStatusChange,
  itemsPerPage
}: StatusListProps): JSX.Element => {
  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (paginationState.currentPage - 1) * itemsPerPage;
    return classData.slice(startIndex, startIndex + itemsPerPage);
  }, [classData, paginationState.currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      onPaginationChange(page);
    },
    [onPaginationChange]
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ListContainer>
        <List
          sx={{
            overflowY: "auto"
          }}
        >
          {currentItems.map((classItem) => {
            const isModified = changeMap.has(classItem.classId);

            return (
              <Box key={classItem.classId}>
                <ListItemButton
                  selected={isModified}
                  sx={{
                    borderLeft: isModified ? `4px solid #ffa726` : "none"
                  }}
                  onClick={() => onStatusChange(classItem.classId, property)}
                >
                  <ListItemText
                    primary={
                      <Box>
                        {getMinimalClassName(classItem)}
                        {isModified && <ModifiedBadge>Modified</ModifiedBadge>}
                      </Box>
                    }
                    secondary={getCourseName(classItem.course)}
                  />
                </ListItemButton>
                <Divider component="li" />
              </Box>
            );
          })}
        </List>

        <Pagination
          containerProps={{
            padding: (theme) => theme.spacing(1),
            borderTop: (theme) => `1px solid ${theme.palette.divider}`
          }}
          count={paginationState.totalPages}
          page={paginationState.currentPage}
          onChange={handlePageChange}
        />
      </ListContainer>
    </Box>
  );
};

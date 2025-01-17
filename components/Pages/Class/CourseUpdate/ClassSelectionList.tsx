import React, { useCallback, useMemo } from "react";
import { Box, Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getCourseName, getMinimalClassName } from "@sonamusica-fe/utils/StringUtil";
import { Class, PaginationState } from "@sonamusica-fe/types";
import Pagination from "@sonamusica-fe/components/Pagination";
import Tooltip from "@sonamusica-fe/components/Tooltip";

interface ClassSelectionListProps {
  classData: Class[];
  selectedClass?: Class;
  paginationState: PaginationState;
  onClassSelect: (cls?: Class) => void;
  onPaginationChange: (page: number) => void;
  itemsPerPage: number;
}

const ListContainer = styled(Box)(({ theme }) => ({
  height: "450px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

export const ClassSelectionList = ({
  classData,
  selectedClass,
  paginationState,
  onClassSelect,
  onPaginationChange,
  itemsPerPage
}: ClassSelectionListProps): JSX.Element => {
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

  const getDisplayName = (cls: Class): string => {
    return getMinimalClassName(cls);
  };

  return (
    <ListContainer>
      <List
        sx={{
          overflowY: "auto"
        }}
      >
        {currentItems.map((classItem) => (
          <Tooltip
            title={classItem.isDeactivated ? "Activate this class to modify its course" : ""}
            followCursor
            key={classItem.classId}
          >
            <>
              <ListItemButton
                selected={selectedClass?.classId === classItem.classId}
                disabled={classItem.isDeactivated}
                onClick={() =>
                  onClassSelect(
                    selectedClass?.classId === classItem.classId ? undefined : classItem
                  )
                }
              >
                <ListItemText
                  primary={getDisplayName(classItem)}
                  secondary={getCourseName(classItem.course)}
                />
              </ListItemButton>
              <Divider component="li" />
            </>
          </Tooltip>
        ))}
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
  );
};

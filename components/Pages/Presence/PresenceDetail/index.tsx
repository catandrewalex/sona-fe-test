import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import PresenceDetailTabContainer from "@sonamusica-fe/components/Pages/Presence/PresenceDetail/PresenceDetailTabContainer";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { Class } from "@sonamusica-fe/types";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import React from "react";

type PresenceDetailContainerProps = {
  classData: Class;
};

const PresenceDetailContainer = ({ classData }: PresenceDetailContainerProps): JSX.Element => {
  return (
    <Box mt={1}>
      <Box display="flex">
        <Box flexGrow={1}>
          <FormDataViewerTable
            tableProps={{ size: "small" }}
            tableRowProps={{
              sx: {
                "& .MuiTableCell-root:first-child": {
                  width: "100px"
                }
              }
            }}
            data={[
              { title: "Course", value: getCourseName(classData.course) },
              { title: "Teacher", value: getFullNameFromTeacher(classData.teacher) },
              {
                title: "Student(s)",
                value: classData.students.map(getFullNameFromStudent).join(", ")
              }
            ]}
            CellValueComponent={Typography}
            cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
          />
        </Box>
        <Box width={200}>
          <Button startIcon={<Add />} fullWidth variant="outlined" color="info">
            Add Presence
          </Button>
        </Box>
      </Box>
      <PresenceDetailTabContainer
        teacherId={classData.teacher?.teacherId || 0}
        classId={classData.classId}
        studentsData={classData.students}
      />
    </Box>
  );
};

export default PresenceDetailContainer;

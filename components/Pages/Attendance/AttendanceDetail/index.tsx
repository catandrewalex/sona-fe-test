import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import AttendanceDetailTabContainer from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTabContainer";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import AttendanceModalForm from "@sonamusica-fe/components/Pages/Attendance/AttendanceModalForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Attendance, Class, Teacher } from "@sonamusica-fe/types";
import {
  getCourseName,
  getFullNameFromStudent,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useReducer, useState } from "react";

type AttendanceDetailContainerProps = {
  classData: Class;
};

const AttendanceDetailContainer = ({ classData }: AttendanceDetailContainerProps): JSX.Element => {
  const [selectedData, setSelectedData] = useState<Attendance>();
  const [teacherOptions, setTeacherOptions] = useState<Teacher[]>([]);
  // we switch this true/false to force render on AttendanceDetailTabContainer, whenever the AttendanceForm is submitted
  const [forceRenderCounter, forceRender] = useReducer((prev) => prev + 1, 0);

  const { query } = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const openForm = useCallback(
    (data?: Attendance) => {
      setOpen(true);
      if (data) {
        setSelectedData(data);
      }
    },
    [setOpen]
  );

  const closeForm = useCallback(() => {
    setOpen(false);
    setSelectedData(undefined);
  }, [setOpen, setSelectedData]);

  const apiTransformer = useApiTransformer();
  const { showSnackbar } = useSnack();

  const fetchTeacherOptions = useCallback(() => {
    API.GetTeacherDropdownOptions().then((response) => {
      const parsedClassData = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedClassData) !== FailedResponse.prototype) {
        setTeacherOptions((parsedClassData as ResponseMany<Teacher>).results);
      } else {
        showSnackbar("Failed to fetch teacher options!", "error");
      }
    });
  }, [setTeacherOptions]);

  const onSubmit = useCallback(() => forceRender(), [forceRender]);

  useEffect(fetchTeacherOptions, [setTeacherOptions]);

  const preSelectedStudentId = typeof query.studentId == "string" ? parseInt(query.studentId) : 0;

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
          <Button
            disabled={classData.students.length === 0}
            onClick={() => openForm()}
            startIcon={<Add />}
            fullWidth
            variant="outlined"
            color="info"
          >
            Add Attendance
          </Button>
        </Box>
      </Box>
      {classData.students.length > 0 && (
        <AttendanceDetailTabContainer
          studentsData={classData.students}
          teacherId={classData.teacher?.teacherId || 0}
          classId={classData.classId}
          openForm={openForm}
          preSelectedStudentId={preSelectedStudentId}
          forceRenderCounter={forceRenderCounter}
        />
      )}
      <AttendanceModalForm
        data={selectedData}
        classData={classData}
        teacherOptions={teacherOptions}
        onClose={closeForm}
        open={open}
        onSubmit={onSubmit}
      ></AttendanceModalForm>
    </Box>
  );
};

export default AttendanceDetailContainer;

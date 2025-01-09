import { Add } from "@mui/icons-material";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import AttendanceDetailTabContainer from "@sonamusica-fe/components/Pages/Attendance/AttendanceDetail/AttendanceDetailTabContainer";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import AttendanceModalForm from "@sonamusica-fe/components/Pages/Attendance/AttendanceModalForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import { Attendance, Class, Teacher } from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getCourseName,
  getFullNameFromTeacher
} from "@sonamusica-fe/utils/StringUtil";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useReducer, useState } from "react";

type AttendanceDetailContainerProps = {
  classData: Class;
  isUserHasWriteAccess: boolean;
};

const AttendanceDetailContainer = ({
  classData,
  isUserHasWriteAccess
}: AttendanceDetailContainerProps): JSX.Element => {
  const [selectedData, setSelectedData] = useState<Attendance>();
  const [teacherOptions, setTeacherOptions] = useState<Teacher[]>([]);
  // we increment this counter to force render on AttendanceDetailTabContainer, whenever the AttendanceForm is submitted (both add & edit)
  const [forceRenderCounter, forceRender] = useReducer((prev) => prev + 1, 0);

  const [isDisplayForSharing, setisDisplayForSharing] = useState<boolean>(false);

  const parentFriendlyHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setisDisplayForSharing(event.target.checked);
  }, []);

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
    API.GetTeacherForAttendanceDropdownOptions().then((response) => {
      const parsedClassData = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedClassData) !== FailedResponse.prototype) {
        setTeacherOptions((parsedClassData as ResponseMany<Teacher>).results);
      } else {
        showSnackbar("Failed to fetch teacher options!", "error");
      }
    });
  }, [setTeacherOptions]);

  const onAddOrEditSubmit = useCallback(() => forceRender(), [forceRender]);

  useEffect(fetchTeacherOptions, [setTeacherOptions]);

  const preSelectedStudentId = typeof query.studentId == "string" ? parseInt(query.studentId) : 0;

  const courseDisplayString = `${getCourseName(classData.course)} (${
    classData.course.defaultDurationMinute
  } min)`;

  const courseFeeDisplayString = convertNumberToCurrencyString(classData.course.defaultFee);
  const transportFeeDisplayString = convertNumberToCurrencyString(classData.transportFee);
  const teacherSpecialFeeDisplayString = convertNumberToCurrencyString(
    classData.teacherSpecialFee ?? 0
  );

  let feesDisplayString = "";
  if (classData.teacherSpecialFee) {
    feesDisplayString = `${teacherSpecialFeeDisplayString} (Special Fee) + ${transportFeeDisplayString} (Transport)`;
  } else {
    feesDisplayString = `${courseFeeDisplayString} (Course) + ${transportFeeDisplayString} (Transport)`;
  }

  return (
    <Box mt={1}>
      <Box display="flex" flexWrap="wrap" rowGap={2}>
        <Box flexGrow={8}>
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
              { title: "Course", value: courseDisplayString },
              { title: "Fees", value: feesDisplayString },
              { title: "Teacher", value: getFullNameFromTeacher(classData.teacher) }
            ]}
            CellValueComponent={Typography}
            cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
          />
        </Box>
        <Box width={184} flexGrow={1}>
          <Button
            disabled={classData.students.length === 0 || !isUserHasWriteAccess}
            onClick={() => openForm()}
            startIcon={<Add />}
            fullWidth
            variant="outlined"
            color="info"
          >
            Add Attendance
          </Button>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <FormControlLabel
              control={<Switch checked={isDisplayForSharing} onChange={parentFriendlyHandler} />}
              label="Sharing-friendly View"
            />
          </Box>
        </Box>
      </Box>
      {classData.students.length > 0 && (
        <AttendanceDetailTabContainer
          studentsData={classData.students}
          teacherId={classData.teacher?.teacherId || 0}
          classId={classData.classId}
          isUserHasWriteAccess={isUserHasWriteAccess}
          openForm={openForm}
          preSelectedStudentId={preSelectedStudentId}
          forceRenderCounter={forceRenderCounter}
          isDisplayForSharing={isDisplayForSharing}
        />
      )}
      {classData.students.length === 0 && (
        <Typography mt={1} color={(theme) => theme.palette.warning.main} fontWeight="bold">
          This class does not have any student.
        </Typography>
      )}
      <AttendanceModalForm
        data={selectedData}
        classData={classData}
        teacherOptions={teacherOptions}
        onClose={closeForm}
        open={open}
        onSubmit={onAddOrEditSubmit}
      ></AttendanceModalForm>
    </Box>
  );
};

export default AttendanceDetailContainer;

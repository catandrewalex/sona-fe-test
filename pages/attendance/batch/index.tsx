import React, { useState, useCallback, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import { Class, Teacher } from "@sonamusica-fe/types";
import { MemoizedAttendanceBatchForm } from "@sonamusica-fe/components/Pages/Attendance/AttendanceBatch/AttendanceBatchForm";
import { AttendanceBatchTable } from "@sonamusica-fe/components/Pages/Attendance/AttendanceBatch/AttendanceBatchTable";
import API, { useApiTransformer, ADMIN_API } from "@sonamusica-fe/api";
import { FailedResponse, ResponseMany } from "api";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import {
  AddAttendanceBatchFormData,
  AddAttendanceBatchFormRequest
} from "@sonamusica-fe/types/form/attendance";
import { convertMomentDateToRFC3339 } from "@sonamusica-fe/utils/StringUtil";
import PageContainer from "@sonamusica-fe/components/PageContainer";

const AttendanceBatchPage = (): JSX.Element => {
  const { showSnackbar } = useSnack();
  // const [loading, setLoading] = useState<boolean>(true);

  const [attendanceBatchFormDataList, setAttendanceBatchFormDataList] = useState<
    AddAttendanceBatchFormData[]
  >([]);

  const [classData, setClassData] = useState<Class[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);

  const apiTransformer = useApiTransformer();

  useEffect(() => {
    ADMIN_API.AdminGetAllClass({ includeDeactivated: false }).then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        setClassData(
          (parsedResponse as ResponseMany<Class>).results.filter((val) => val.students.length > 0)
        );
      }
    });
  }, []);

  useEffect(() => {
    ADMIN_API.GetAllTeacher().then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
      }
    });
  }, []);

  const handleAddAttendance = useCallback((attendanceBatchFormData: AddAttendanceBatchFormData) => {
    if (!attendanceBatchFormData.class || !attendanceBatchFormData.teacher) return;

    setAttendanceBatchFormDataList((prev) => [...prev, attendanceBatchFormData]);
  }, []);

  const handleRemoveAttendance = useCallback((index: number) => {
    setAttendanceBatchFormDataList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearAll = useCallback(() => {
    setAttendanceBatchFormDataList([]);
  }, []);

  const handleSubmitBatch = useCallback(async () => {
    if (attendanceBatchFormDataList.length === 0) {
      showSnackbar("Please add at least one attendance record", "error");
      return;
    }

    // convert to AddAttendanceBatchFormRequest, while filtering invalid records.
    const attendancesBatchFormRequests = attendanceBatchFormDataList.flatMap(
      (attendanceFormData) => {
        if (!attendanceFormData.class || !attendanceFormData.teacher) {
          return [];
        }
        return [
          {
            classId: attendanceFormData.class.classId,
            date: convertMomentDateToRFC3339(attendanceFormData.date),
            usedStudentTokenQuota: attendanceFormData.usedStudentTokenQuota,
            duration: attendanceFormData.duration,
            note: attendanceFormData.note,
            teacherId: attendanceFormData.teacher.teacherId
          } as AddAttendanceBatchFormRequest
        ];
      }
    );

    const response = await API.AddAttendanceBatch(attendancesBatchFormRequests);
    const parsedResponse = apiTransformer(response, true);
    if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
      return parsedResponse as FailedResponse;
    } else {
      handleClearAll();
    }
  }, [showSnackbar, attendanceBatchFormDataList, handleClearAll]);

  return (
    <PageContainer navTitle="Manage Attendance">
      <Box sx={{ mt: 1, position: "relative" }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Batch Attendance Entry
        </Typography>

        <MemoizedAttendanceBatchForm
          classData={classData}
          teacherData={teacherData}
          onAddAttendanceBatchFormData={handleAddAttendance}
        />

        <AttendanceBatchTable
          attendanceBatchFormDataList={attendanceBatchFormDataList}
          onRemove={handleRemoveAttendance}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleClearAll}>
            Remove All
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmitBatch}>
            Submit Batch
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default AttendanceBatchPage;

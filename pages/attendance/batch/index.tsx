import React, { useState, useCallback, useEffect } from "react";
import { Typography, Box } from "@mui/material";
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
import { SmallCancelAndSubmitButtons } from "@sonamusica-fe/components/Form/SmallCancelAndSubmitButtons";

const AttendanceBatchPage = (): JSX.Element => {
  const { showSnackbar } = useSnack();
  const [loading, setLoading] = useState<boolean>(false);

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

    setAttendanceBatchFormDataList((prev) => {
      const isExist =
        prev.length > 0 &&
        prev.findIndex(
          (val) =>
            val.class?.classId === attendanceBatchFormData.class?.classId &&
            val.date.diff(attendanceBatchFormData.date) === 0
        ) != -1;
      if (!isExist) {
        return [...prev, attendanceBatchFormData];
      } else {
        return prev;
      }
    });
  }, []);

  const handleRemoveAttendance = useCallback((index: number) => {
    setAttendanceBatchFormDataList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveAll = useCallback(() => {
    setAttendanceBatchFormDataList([]);
  }, []);

  const handleSubmitBatch = useCallback(async () => {
    if (attendanceBatchFormDataList.length === 0) {
      showSnackbar("Please add at least one attendance record", "error");
      return;
    }

    setLoading(true);

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
    setLoading(false);
    const parsedResponse = apiTransformer(response, true);
    if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
      return parsedResponse as FailedResponse;
    } else {
      handleRemoveAll();
    }
  }, [showSnackbar, attendanceBatchFormDataList, handleRemoveAll, setLoading]);

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

        <SmallCancelAndSubmitButtons
          loading={loading}
          cancelButtonText="Remove All"
          cancelButtonDisabled={loading}
          cancelButtonOnClick={handleRemoveAll}
          submitButtonText="Submit Batch"
          submitButtonOnClick={handleSubmitBatch}
        ></SmallCancelAndSubmitButtons>
      </Box>
    </PageContainer>
  );
};

export default AttendanceBatchPage;

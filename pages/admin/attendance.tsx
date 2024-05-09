import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { Attendance, StudentLearningToken, Student, Teacher, Class } from "@sonamusica-fe/types";
import PageAdminAttendanceTable from "@sonamusica-fe/components/Pages/Admin/Attendance/PageAdminAttendanceTable";
import PageAdminAttendanceModalForm from "@sonamusica-fe/components/Pages/Admin/Attendance/PageAdminAttendanceModalForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import WarningCRUD from "@sonamusica-fe/components/WarningCRUD";

const AttendancePage = (): JSX.Element => {
  const [data, setData] = useState<Array<Attendance>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Attendance>();
  const [studentLearningTokenData, setStudentLearningTokenData] = useState<StudentLearningToken[]>(
    []
  );
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [classData, setClassData] = useState<Class[]>([]);

  const { showSnackbar } = useSnack();
  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  const openForm = useCallback(() => {
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setOpen(false);
    setSelectedData(undefined);
  }, []);

  useEffect(() => {
    if (user) {
      const promises = [
        ADMIN_API.GetAllAttendance(),
        ADMIN_API.GetAllStudentLearningToken(),
        ADMIN_API.GetAllStudent(),
        ADMIN_API.GetAllTeacher(),
        ADMIN_API.AdminGetAllClass()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Attendance>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Attendance>).results);
          }
        } else {
          showSnackbar("Failed to fetch attendance data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<StudentLearningToken>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentLearningTokenData(
              (parsedResponse as ResponseMany<StudentLearningToken>).results
            );
          }
        } else {
          showSnackbar("Failed to fetch student learning token data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Student>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentData((parsedResponse as ResponseMany<Student>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[3].status === "fulfilled") {
          const response = value[3].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[4].status === "fulfilled") {
          const response = value[4].value as SuccessResponse<Class>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setClassData((parsedResponse as ResponseMany<Class>).results);
          }
        } else {
          showSnackbar("Failed to fetch class data!", "error");
        }

        finishLoading();
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Attendance">
      <WarningCRUD link="/attendance" />
      <PageAdminAttendanceTable
        data={data}
        studentData={studentData}
        teacherData={teacherData}
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminAttendanceModalForm
        selectedData={selectedData}
        studentLearningTokenData={studentLearningTokenData}
        teacherData={teacherData}
        studentData={studentData}
        classData={classData}
        data={data}
        open={open}
        setData={setData}
        onClose={closeForm}
      />
    </PageContainer>
  );
};

export default AttendancePage;

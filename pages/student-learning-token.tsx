import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { StudentLearningToken, StudentEnrollment, Student, Teacher } from "@sonamusica-fe/types";
import PageAdminStudentLearningTokenTable from "@sonamusica-fe/components/Pages/Admin/StudentLearningToken/PageAdminStudentLearningTokenTable";
import PageAdminStudentLearningTokenForm from "@sonamusica-fe/components/Pages/Admin/StudentLearningToken/PageAdminStudentLearningTokenForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
import WarningCRUD from "@sonamusica-fe/components/WarningCRUD";

const StudentLearningTokenPage = (): JSX.Element => {
  const [data, setData] = useState<Array<StudentLearningToken>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<StudentLearningToken>();
  const [studentEnrollmentData, setStudentEnrollmentData] = useState<StudentEnrollment[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);

  const { showSnackbar } = useSnack();
  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      const promises = [
        API.GetAllStudentLearningToken(),
        API.GetAllStudentEnrollment(),
        API.GetAllStudent(),
        API.GetAllTeacher()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<StudentLearningToken>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<StudentLearningToken>).results);
          }
        } else {
          showSnackbar("Failed to fetch student learning token data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<StudentEnrollment>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentEnrollmentData((parsedResponse as ResponseMany<StudentEnrollment>).results);
          }
        } else {
          showSnackbar("Failed to fetch student enrollment data!", "error");
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

        finishLoading();
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Student Learning Token">
      <WarningCRUD />
      <PageAdminStudentLearningTokenTable
        data={data}
        studentData={studentData}
        teacherData={teacherData}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminStudentLearningTokenForm
        selectedData={selectedData}
        studentEnrollmentData={studentEnrollmentData}
        data={data}
        open={open}
        setData={setData}
        onClose={() => {
          setOpen(false);
          setSelectedData(undefined);
        }}
      />
    </PageContainer>
  );
};

export default StudentLearningTokenPage;

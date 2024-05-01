import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { Class, Course, Student, Teacher } from "@sonamusica-fe/types";
import PageAdminClassTable from "@sonamusica-fe/components/Pages/Admin/Class/PageAdminClassTable";
import PageAdminClassModalForm from "@sonamusica-fe/components/Pages/Admin/Class/PageAdminClassModalForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";
// import PageAdminClassForm from "@sonamusica-fe/components/Pages/Admin/Class/PageAdminClassForm";

const ClassPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Class>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Class>();
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);

  const finishLoading = useApp((state) => state.finishLoading);
  const { showSnackbar } = useSnack();
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
        ADMIN_API.AdminGetAllClass(),
        ADMIN_API.GetAllStudent(),
        ADMIN_API.GetAllTeacher(),
        ADMIN_API.GetAllCourse()
      ];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Class>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Class>).results);
          }
        } else {
          showSnackbar("Failed to fetch classes data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Student>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setStudentData((parsedResponse as ResponseMany<Student>).results);
          }
        } else {
          showSnackbar("Failed to fetch students data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[3].status === "fulfilled") {
          const response = value[3].value as SuccessResponse<Course>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setCourseData((parsedResponse as ResponseMany<Course>).results);
          }
        } else {
          showSnackbar("Failed to fetch courses data!", "error");
        }

        finishLoading();
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Class">
      <PageAdminClassTable
        data={data}
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
        studentData={studentData}
      />
      <PageAdminClassModalForm
        data={data}
        open={open}
        setData={setData}
        onClose={closeForm}
        courseData={courseData}
        selectedData={selectedData}
        studentData={studentData}
        teacherData={teacherData}
      />
    </PageContainer>
  );
};

export default ClassPage;

import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { TeacherSpecialFee, Teacher, Course } from "@sonamusica-fe/types";
import PageAdminTeacherSpecialFeeTable from "@sonamusica-fe/components/Pages/Admin/TeacherSpecialFee/PageAdminTeacherSpecialFeeTable";
import PageAdminTeacherSpecialFeeForm from "@sonamusica-fe/components/Pages/Admin/TeacherSpecialFee/PageAdminTeacherSpecialFeeForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";

const TeacherSpecialFeePage = (): JSX.Element => {
  const [data, setData] = useState<Array<TeacherSpecialFee>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<TeacherSpecialFee>();
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);

  const { showSnackbar } = useSnack();
  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      const promises = [API.GetAllTeacherSpecialFee(), API.GetAllTeacher(), API.GetAllCourse()];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<TeacherSpecialFee>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<TeacherSpecialFee>).results);
          }
        } else {
          showSnackbar("Failed to fetch teacher special fees data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Teacher>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setTeacherData((parsedResponse as ResponseMany<Teacher>).results);
          }
        } else {
          showSnackbar("Failed to fetch teachers data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Course>;
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
    <PageContainer navTitle="Teacher Special Fee">
      <PageAdminTeacherSpecialFeeTable
        data={data}
        teacherData={teacherData}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminTeacherSpecialFeeForm
        selectedData={selectedData}
        courseData={courseData}
        teacherData={teacherData}
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

export default TeacherSpecialFeePage;

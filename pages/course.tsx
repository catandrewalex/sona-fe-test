import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { Course, Grade, Instrument } from "@sonamusica-fe/types";
import PageAdminCourseTable from "@sonamusica-fe/components/Pages/Admin/Course/PageAdminCourseTable";
import PageAdminCourseForm from "@sonamusica-fe/components/Pages/Admin/Course/PageAdminCourseForm";
import { useSnack } from "@sonamusica-fe/providers/SnackProvider";

const CoursePage = (): JSX.Element => {
  const [data, setData] = useState<Array<Course>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Course>();
  const [gradeData, setGradeData] = useState<Grade[]>([]);
  const [instrumentData, setInstrumentData] = useState<Instrument[]>([]);

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
      const promises = [API.GetAllCourse(), API.GetAllGrade(), API.GetAllInstrument()];
      Promise.allSettled(promises).then((value) => {
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Course>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Course>).results);
          }
        } else {
          showSnackbar("Failed to fetch courses data!", "error");
        }
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Grade>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setGradeData((parsedResponse as ResponseMany<Grade>).results);
          }
        } else {
          showSnackbar("Failed to fetch grades data!", "error");
        }
        if (value[2].status === "fulfilled") {
          const response = value[2].value as SuccessResponse<Instrument>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setInstrumentData((parsedResponse as ResponseMany<Instrument>).results);
          }
        } else {
          showSnackbar("Failed to fetch instruments data!", "error");
        }

        finishLoading();
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Course">
      <PageAdminCourseTable
        data={data}
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminCourseForm
        selectedData={selectedData}
        instrumentData={instrumentData}
        gradeData={gradeData}
        data={data}
        open={open}
        setData={setData}
        onClose={closeForm}
      />
    </PageContainer>
  );
};

export default CoursePage;

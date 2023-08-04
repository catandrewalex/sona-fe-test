import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany, SuccessResponse } from "api";
import { Course, Grade, Instrument } from "@sonamusica-fe/types";
import PageAdminCourseTable from "@sonamusica-fe/components/Pages/Admin/Course/PageAdminCourseTable";
import PageAdminCourseForm from "@sonamusica-fe/components/Pages/Admin/Course/PageAdminCourseForm";

const CoursePage = (): JSX.Element => {
  const [data, setData] = useState<Array<Course>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Course>();
  const [gradeData, setGradeData] = useState<Grade[]>([]);
  const [instrumentData, setInstrumentData] = useState<Instrument[]>([]);

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      const promises = [API.GetAllCourse(), API.GetAllGrade()];
      Promise.allSettled(promises).then((value) => {
        let allPassed = true;
        if (value[0].status === "fulfilled") {
          const response = value[0].value as SuccessResponse<Course>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Course>).results);
          }
        } else allPassed = false;
        if (value[1].status === "fulfilled") {
          const response = value[1].value as SuccessResponse<Grade>;
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setGradeData((parsedResponse as ResponseMany<Grade>).results);
          }
        } else allPassed = false;

        setInstrumentData([
          { instrumentId: 1, name: "Piano" },
          { instrumentId: 2, name: "Biola" }
        ]);
        if (allPassed) {
          finishLoading();
          setLoading(false);
        }
      });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Course">
      <PageAdminCourseTable
        data={data}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
        instrumentData={instrumentData}
        gradeData={gradeData}
      />
      <PageAdminCourseForm
        selectedData={selectedData}
        instrumentData={instrumentData}
        gradeData={gradeData}
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

export default CoursePage;

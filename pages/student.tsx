import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { Student } from "@sonamusica-fe/types";
import PageAdminStudentTable from "@sonamusica-fe/components/Pages/Admin/Student/PageAdminStudentTable";
import PageAdminStudentForm from "@sonamusica-fe/components/Pages/Admin/Student/PageAdminStudentForm";

const StudentPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Student>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      API.GetAllStudent()
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Student>).results);
          }
        })
        .finally(() => {
          finishLoading();
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Student">
      <PageAdminStudentTable
        data={data}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
      <PageAdminStudentForm
        data={data}
        open={open}
        setData={setData}
        onClose={() => setOpen(false)}
      />
    </PageContainer>
  );
};

export default StudentPage;

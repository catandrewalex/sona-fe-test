import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { ADMIN_API, useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { Student } from "@sonamusica-fe/types";
import PageAdminStudentTable from "@sonamusica-fe/components/Pages/Admin/Student/PageAdminStudentTable";
import PageAdminStudentModalForm from "@sonamusica-fe/components/Pages/Admin/Student/PageAdminStudentModalForm";

const StudentPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Student>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  const openForm = useCallback(() => {
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (user) {
      ADMIN_API.GetAllStudent()
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
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
      <PageAdminStudentModalForm data={data} open={open} setData={setData} onClose={closeForm} />
    </PageContainer>
  );
};

export default StudentPage;

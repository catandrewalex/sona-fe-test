import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { Teacher } from "@sonamusica-fe/types";
import PageAdminTeacherTable from "@sonamusica-fe/components/Pages/Admin/Teacher/PageAdminTeacherTable";
import PageAdminTeacherForm from "@sonamusica-fe/components/Pages/Admin/Teacher/PageAdminTeacherForm";

const TeacherPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Teacher>>([]);
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
      API.GetAllTeacher()
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Teacher>).results);
          }
        })
        .finally(() => {
          finishLoading();
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Teacher">
      <PageAdminTeacherTable
        data={data}
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
      <PageAdminTeacherForm data={data} open={open} setData={setData} onClose={closeForm} />
    </PageContainer>
  );
};

export default TeacherPage;

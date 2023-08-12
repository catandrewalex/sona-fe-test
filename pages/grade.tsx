import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { Grade } from "@sonamusica-fe/types";
import PageAdminGradeTable from "@sonamusica-fe/components/Pages/Admin/Grade/PageAdminGradeTable";
import PageAdminGradeForm from "@sonamusica-fe/components/Pages/Admin/Grade/PageAdminGradeForm";

const GradePage = (): JSX.Element => {
  const [data, setData] = useState<Array<Grade>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Grade>();

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
      API.GetAllGrade()
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Grade>).results);
          }
        })
        .finally(() => {
          finishLoading();
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Grade">
      <PageAdminGradeTable
        data={data}
        openModal={openForm}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminGradeForm
        selectedData={selectedData}
        data={data}
        open={open}
        setData={setData}
        onClose={closeForm}
      />
    </PageContainer>
  );
};

export default GradePage;

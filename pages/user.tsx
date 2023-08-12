import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { User } from "@sonamusica-fe/types";
import PageAdminUserTable from "@sonamusica-fe/components/Pages/Admin/User/PageAdminUserTable";
import PageAdminUserForm from "@sonamusica-fe/components/Pages/Admin/User/PageAdminUserForm";

const UserPage = (): JSX.Element => {
  const [data, setData] = useState<Array<User>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<User>();

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
    API.GetAllUser()
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          setData((parsedResponse as ResponseMany<User>).results);
        }
      })
      .finally(() => {
        finishLoading();
        setLoading(false);
      });
  }, [user]);

  return (
    <PageContainer navTitle="User">
      <PageAdminUserTable
        data={data}
        setSelectedData={setSelectedData}
        loading={loading}
        openModal={openForm}
      />
      <PageAdminUserForm
        data={data}
        setData={setData}
        selectedData={selectedData}
        open={open}
        onClose={closeForm}
      />
    </PageContainer>
  );
};

export default UserPage;

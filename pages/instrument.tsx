import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { Instrument } from "@sonamusica-fe/types";
import PageAdminInstrumentTable from "@sonamusica-fe/components/Pages/Admin/Instrument/PageAdminInstrumentTable";
import PageAdminInstrumentForm from "@sonamusica-fe/components/Pages/Admin/Instrument/PageAdminInstrumentForm";

const InstrumentPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Instrument>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Instrument>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  useEffect(() => {
    if (user) {
      API.GetAllInstrument()
        .then((response) => {
          const parsedResponse = apiTransformer(response, false);
          if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
            setData((parsedResponse as ResponseMany<Instrument>).results);
          }
        })
        .finally(() => {
          finishLoading();
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <PageContainer navTitle="Instrument">
      <PageAdminInstrumentTable
        data={data}
        openModal={() => setOpen(true)}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectedData={setSelectedData}
      />
      <PageAdminInstrumentForm
        selectedData={selectedData}
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

export default InstrumentPage;

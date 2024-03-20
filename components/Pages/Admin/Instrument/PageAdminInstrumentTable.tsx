import Table from "@sonamusica-fe/components/Table";
import useTableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import { useAlertDialog } from "@sonamusica-fe/providers/AlertDialogProvider";
import { Instrument } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import React from "react";
import { FailedResponse } from "api";

type PageAdminInstrumentTableProps = {
  data: Instrument[];
  setSelectedData: (newSelectedData?: Instrument) => void;
  openModal: () => void;
  loading: boolean;
  setLoading: (newData: boolean) => void;
  setData: (newData: Instrument[]) => void;
};

const PageAdminInstrumentTable = ({
  data,
  setSelectedData,
  openModal,
  loading,
  setLoading,
  setData
}: PageAdminInstrumentTableProps): JSX.Element => {
  const apiTransformer = useApiTransformer();
  const { showDialog } = useAlertDialog();

  return (
    <TableContainer testIdContext="AdminInstrument">
      <Table
        name="Instrument"
        testIdContext="AdminInstrument"
        loading={loading}
        getRowId={(row) => row.instrumentId}
        disableSelectionOnClick
        addItemToolbar
        addItemToolbarHandler={openModal}
        rows={data}
        columns={[
          useTableActions({
            editHandler: ({ id }) => {
              setSelectedData(data.filter((val) => val.instrumentId === id)[0]);
              openModal();
            },
            deleteHandler: ({ id, row }) => {
              showDialog(
                {
                  title: "Delete Instrument",
                  content: `Are you sure to delete ${row.name}?`
                },
                () => {
                  setLoading(true);
                  API.DeleteInstrument([{ instrumentId: id as number }])
                    .then((response) => {
                      const parsedResponse = apiTransformer(response, true);
                      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype)
                        setData(data.filter((value) => value.instrumentId !== id));
                    })
                    .finally(() => setLoading(false));
                }
              );
            }
          }),
          {
            field: "instrumentId",
            headerName: "ID",
            width: 100,
            align: "center",
            headerAlign: "center"
          },
          {
            field: "name",
            headerName: "Instrument Name",
            flex: 1
          }
        ]}
        tableMenu={[
          {
            type: "text-input",
            field: "name",
            md: 12,
            lg: 12
          }
        ]}
      />
    </TableContainer>
  );
};

export default PageAdminInstrumentTable;

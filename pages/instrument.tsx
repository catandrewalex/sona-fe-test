import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { ResponseMany } from "api";
import { Instrument, User, UserType } from "@sonamusica-fe/types";
import TableContainer from "@sonamusica-fe/components/Table/TableContainer";
import Table from "@sonamusica-fe/components/Table";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiRef
} from "@mui/x-data-grid";
import ErrorDataGridEmpty from "@sonamusica-fe/components/Error/ErrorDataGridEmpty";
import Select from "@sonamusica-fe/components/Form/Select";
import Toolbar from "@sonamusica-fe/components/Table/Toolbar";
import TableActions from "@sonamusica-fe/components/Table/CustomCell/TableActions";
import Modal from "@sonamusica-fe/components/Modal";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import moment from "moment";
import AddUserModal from "@sonamusica-fe/components/AddUserModal";

const InstrumentPage = (): JSX.Element => {
  const [data, setData] = useState<Array<Instrument>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedData, setSelectedData] = useState<Instrument>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();
  const apiRef = useGridApiRef();

  useEffect(() => {
    // API.GetAllUser().then((response) => {
    //   const instruments = apiTransformer(response, false) as ResponseMany<User>;
    //   if (instruments) setData(instruments.results);
    //   finishLoading();
    //   setLoading(false);
    // });
    setData([
      { id: 1, name: "Vocal" },
      { id: 2, name: "Piano" },
      { id: 3, name: "Violin" },
      { id: 4, name: "Cello" },
      { id: 5, name: "Guitar Classic" },
      { id: 6, name: "Music Theory" },
      { id: 7, name: "Guitar Performance" },
      { id: 8, name: "Ukulele" },
      { id: 9, name: "Drum" },
      { id: 10, name: "Flute" },
      { id: 11, name: "Saxophone" },
      { id: 12, name: "Trumpet" }
    ]);
    finishLoading();
    setLoading(false);
  }, [user]);

  const submitHandler = (data: User) => {};

  /*
  Add new row to datagrid:apiRef.current.updateRows([createRandomRow()]);
  */

  return (
    <PageContainer navTitle="Instrument">
      <TableContainer>
        <Table
          name="Instrument"
          loading={loading}
          disableSelectionOnClick
          addItemToolbar
          addItemToolbarHandler={() => setOpen(true)}
          rows={data}
          columns={[
            TableActions({
              editHandler: (id) => {
                setSelectedData(data[(id as number) - 1]);
                setOpen(true);
              },
              deleteDisableMessage: "This feature is not available yet."
            }),
            {
              field: "name",
              headerName: "Instrument Name",
              // valueGetter: (params) =>
              //   params.row.userDetail.firstName + " " + params.row.userDetail.lastName,
              flex: 2
            }
          ]}
          tableMenu={[
            {
              type: "text-input",
              field: "name",
              md: 6,
              lg: 6
              // filterHandler: (data, value) =>
              //   data.userDetail.firstName.toLowerCase().includes(value.toLowerCase()) ||
              //   data.userDetail.lastName.toLowerCase().includes(value.toLowerCase())
            }
          ]}
        />
      </TableContainer>
      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add User"
        onSuccess={submitHandler}
        submitApi={API.GetAllUser}
        data={selectedData}
      />
    </PageContainer>
  );
};

export default InstrumentPage;

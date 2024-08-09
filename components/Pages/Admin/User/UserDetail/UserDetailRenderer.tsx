import { Typography } from "@mui/material";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import { User } from "@sonamusica-fe/types";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import React from "react";

type UserDetailModalContentProps = {
  selectedUser: User;
};

const UserDetailModalContent = ({ selectedUser }: UserDetailModalContentProps): JSX.Element => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        #{selectedUser.userId} {getFullNameFromUser(selectedUser)}
      </Typography>
      <FormDataViewerTable
        tableProps={{ size: "small", sx: { mt: 1 } }}
        tableRowProps={{
          sx: {
            "& .MuiTableCell-root:first-child": {
              width: "160px",
              pl: 0
            }
          }
        }}
        data={[
          {
            title: "Birthdate",
            value:
              selectedUser.userDetail.birthdate !== undefined
                ? moment(selectedUser.userDetail.birthdate).format("DD MMMM YYYY")
                : "-"
          },
          {
            title: "Address",
            value: selectedUser.userDetail.address ?? "-"
          },
          {
            title: "Phone Number",
            value: selectedUser.userDetail.phoneNumber ?? "-"
          },
          {
            title: "Instagram Account",
            value: selectedUser.userDetail.instagramAccount ?? "-"
          },
          {
            title: "Twitter Account",
            value: selectedUser.userDetail.twitterAccount ?? "-"
          },
          {
            title: "Parent Name",
            value: selectedUser.userDetail.parentName ?? "-"
          },
          {
            title: "Parent Phone Number",
            value: selectedUser.userDetail.parentPhoneNumber ?? "-"
          }
        ]}
        CellValueComponent={Typography}
        cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
      />
    </>
  );
};

export default UserDetailModalContent;

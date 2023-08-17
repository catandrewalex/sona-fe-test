import { useUser } from "@sonamusica-fe/providers/AppProvider";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Popover,
  Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserType } from "@sonamusica-fe/types";
import Modal from "@sonamusica-fe/components/Modal";
import { Cancel, PasswordOutlined, Save } from "@mui/icons-material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { FailedResponse } from "api";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import { getFullNameFromUser } from "@sonamusica-fe/utils/StringUtil";

type MenuListProps = {
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const MenuList = ({ anchorEl, onClose, onLogout, open }: MenuListProps): JSX.Element => {
  const { user } = useUser((state) => ({
    user: state.user
  }));

  const apiTransformer = useApiTransformer();

  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

  let privilegeString = "NONE";
  if (user) {
    switch (user.privilegeType) {
      case UserType.ANONYMOUS:
        privilegeString = "Guest";
        break;
      case UserType.ADMIN:
        privilegeString = "Admin";
        break;
      case UserType.MEMBER:
        privilegeString = "Member";
        break;
      case UserType.STAFF:
        privilegeString = "Staff";
        break;
    }
  }

  const { formRenderer } = useFormRenderer<{ password: string; confirmPassword: string }>(
    {
      testIdContext: "ChangePassword",
      submitContainerProps: { align: "space-between", spacing: 3 },
      cancelButtonProps: {
        startIcon: <Cancel />,
        onClick: () => setShowChangePassword(false)
      },
      promptCancelButtonDialog: true,
      submitButtonProps: { endIcon: <Save /> },
      fields: [
        {
          type: "text",
          name: "password",
          label: "Password",
          formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
          inputProps: { type: "password" },
          validations: []
        },
        {
          type: "text",
          name: "confirmPassword",
          label: "Confirm Password",
          formFieldProps: { lg: 6, md: 6, sx: { pt: "8px !important" } },
          inputProps: { type: "password" },
          validations: [
            { name: "match", parameters: { matcherField: "password", matcherLabel: "Password" } }
          ]
        }
      ],
      errorResponseMapping: {
        password: "newPassword"
      },
      submitHandler: async ({ password }, error) => {
        if (error.password || error.confirmPassword) return Promise.reject();

        const response = await API.ChangePassword(user?.userId || 0, password);
        const parsedResponse = apiTransformer(response, true);
        if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
          return parsedResponse as FailedResponse;
        }
      }
    },
    { password: "", confirmPassword: "" }
  );

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Card sx={{ width: 275 }}>
          <CardContent>
            <Avatar sx={{ m: "auto", width: 80, height: 80 }}>
              {user?.userDetail?.firstName?.charAt(0) ||
                user?.email?.charAt(0)?.toUpperCase() ||
                ""}
              {user?.userDetail?.lastName?.charAt(0)}
            </Avatar>
            <Typography mt={1} textAlign="center" variant="h6">
              {getFullNameFromUser(user)}
            </Typography>
            <Typography
              sx={{ wordWrap: "break-word" }}
              variant="body2"
              textAlign="center"
              mb={0.5}
              color="text.secondary"
            >
              {user?.email}
            </Typography>
            <Typography variant="body1" textAlign="center" mb={0.5}>
              {privilegeString}
            </Typography>
            <Divider />
          </CardContent>
          <CardActions sx={{ mt: -2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Button
                onClick={() => {
                  setShowChangePassword(true);
                  onClose();
                }}
                sx={{ justifyContent: "flex-start" }}
                startIcon={<PasswordOutlined />}
                fullWidth
              >
                Change Password
              </Button>
              <Button
                onClick={onLogout}
                sx={{ justifyContent: "flex-start" }}
                startIcon={<LogoutIcon />}
                fullWidth
              >
                Sign out
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Popover>

      <Modal closeIcon open={showChangePassword} onClose={() => setShowChangePassword(false)}>
        <Typography align="center" variant="h5" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        {formRenderer()}
      </Modal>
    </>
  );
};
export default MenuList;

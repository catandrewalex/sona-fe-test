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
import { PasswordOutlined } from "@mui/icons-material";
import Form from "@sonamusica-fe/components/Form";
import FormField from "@sonamusica-fe/components/Form/FormField";
import TextInput from "@sonamusica-fe/components/Form/TextInput";
import { useCheckRequired, useCheckMatch } from "@sonamusica-fe/utils/ValidationUtil";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import SubmitButtonContainer from "@sonamusica-fe/components/Form/SubmitButtonContainer";
import SubmitButton from "@sonamusica-fe/components/Form/SubmitButton";
import { FailedResponse } from "api";

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
  const [loading, setLoading] = useState<boolean>(false);

  // ==================== For Form in Change Password ==================== //
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");

  const [errorNewPassword, setErrorNewPassword] = useState<string>("");
  const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState<string>("");

  // ==================== For Field Validation ==================== //
  const checkPassword = useCheckRequired(setErrorNewPassword, "Password");
  const checkPasswordConfirmationRequired = useCheckRequired(
    setErrorNewPasswordConfirm,
    "Confirmation Password"
  );
  const checkPasswordConfirmationMatch = useCheckMatch(
    setErrorNewPasswordConfirm,
    "Password & Confirmation Password"
  );

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
              {user?.userDetail.firstName.charAt(0) || user?.email.charAt(0).toUpperCase()}
              {user?.userDetail.lastName?.charAt(0)}
            </Avatar>
            <Typography mt={1} textAlign="center" variant="h6">
              {user?.userDetail.firstName}
              {user?.userDetail.lastName || ""}
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
        <Typography align="center" variant="h5">
          Change Password
        </Typography>
        <Form
          formSubmit={
            <SubmitButtonContainer>
              <SubmitButton fullWidth loading={loading} />
            </SubmitButtonContainer>
          }
          onSubmit={() => {
            const finalCheckPassword = checkPassword(newPassword);
            let finalCheckPasswordConfirm = checkPasswordConfirmationRequired(newPasswordConfirm);
            if (finalCheckPasswordConfirm)
              finalCheckPasswordConfirm = checkPasswordConfirmationMatch(
                newPassword,
                newPasswordConfirm
              );

            if (user && finalCheckPassword && finalCheckPasswordConfirm) {
              setLoading(true);
              API.ChangePassword(user.userId, newPassword)
                .then((response) => {
                  const result = apiTransformer(response, true);
                  if (Object.getPrototypeOf(result) !== FailedResponse.prototype) {
                    setShowChangePassword(false);
                    setNewPassword("");
                    setNewPasswordConfirm("");
                    setErrorNewPassword("");
                    setNewPasswordConfirm("");
                  }
                })
                .finally(() => setLoading(false));
            }
          }}
        >
          <FormField>
            <TextInput
              testIdContext="UserUpsertPassword"
              label="Password"
              type="password"
              required
              value={newPassword}
              errorMsg={errorNewPassword}
              disabled={loading}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPassword(e.target.value);
              }}
            />
          </FormField>
          <FormField>
            <TextInput
              label="Confirm Password"
              type="password"
              required
              value={newPasswordConfirm}
              errorMsg={errorNewPasswordConfirm}
              disabled={loading}
              onChange={(e) => {
                setNewPasswordConfirm(e.target.value);
                if (checkPasswordConfirmationRequired(e.target.value))
                  checkPasswordConfirmationMatch(newPassword, e.target.value);
              }}
              testIdContext="UserUpsertConfirmPassword"
            />
          </FormField>
        </Form>
      </Modal>
    </>
  );
};
export default MenuList;

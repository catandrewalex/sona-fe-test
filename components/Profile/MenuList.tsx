import { useUser } from "@sonamusica-fe/providers/AppProvider";
import React from "react";
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
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";

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

  return (
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
            {user?.userDetail.lastName.charAt(0)}
          </Avatar>
          <Typography mt={1} textAlign="center" variant="h6">
            {user?.userDetail.firstName}
            {user?.userDetail.lastName}
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
            {user?.privilegeType.toString()}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions sx={{ mt: -2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
  );
};
export default MenuList;

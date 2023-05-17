import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import React from "react";
import { useUser } from "@sonamusica-fe/providers/AppProvider";

type ProfileViewProps = {
  open: boolean;
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
};

const ProfileView = ({ open, handleOpen }: ProfileViewProps): JSX.Element => {
  const user = useUser((state) => state.user);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      aria-owns={open ? "topbar-profile-popover" : undefined}
      aria-haspopup="true"
      onClick={handleOpen}
    >
      <Avatar>
        {user?.userDetail.firstName.charAt(0) || user?.email.charAt(0).toUpperCase()}
        {user?.userDetail.lastName.charAt(0)}
      </Avatar>
    </Box>
  );
};
export default ProfileView;

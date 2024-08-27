import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { FormattedMonthName } from "@sonamusica-fe/utils/StringUtil";
import React, { useCallback, useState } from "react";

interface ExpenseDetailMenuButtonProps {
  monthNames: FormattedMonthName[];
  onMenuClick: (item: FormattedMonthName) => void;
}

const DashboardDetailMenuButton = React.memo(
  ({ monthNames, onMenuClick }: ExpenseDetailMenuButtonProps): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<FormattedMonthName>();
    const open = Boolean(anchorEl);

    const handleClose = useCallback(() => setAnchorEl(null), []);
    const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuItemClick = useCallback(
      (item: FormattedMonthName) => {
        setSelected(item);
        onMenuClick(item);
        setAnchorEl(null);
      },
      [onMenuClick]
    );

    return (
      <Box>
        <IconButton onClick={handleOpen}>
          <MenuIcon />
        </IconButton>
        <Menu id="lock-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          {monthNames.map((monthName) => (
            <MenuItem
              key={`${monthName.month}-${monthName.year}`}
              selected={monthName.month === selected?.month && monthName.year === selected?.year}
              onClick={() => handleMenuItemClick(monthName)}
            >
              {monthName.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }
);

export default DashboardDetailMenuButton;

import { SwitchProps } from "@mui/material/Switch";
import React from "react";
import { SxProps } from "@mui/system";

import { FormControlLabel, FormGroup, Switch, Theme } from "@mui/material";

interface StandardSwitchProps extends SwitchProps {
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  labelSx?: SxProps<Theme>;
}

const StandardSwitch = ({
  label,
  labelPlacement,
  labelSx,
  ...props
}: StandardSwitchProps): JSX.Element => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch {...props} />}
        label={label || ""}
        labelPlacement={labelPlacement || "end"}
        sx={labelSx}
      />
    </FormGroup>
  );
};

export default StandardSwitch;

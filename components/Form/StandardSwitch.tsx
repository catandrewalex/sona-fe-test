import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch, { SwitchProps } from "@mui/material/Switch";
import React from "react";
import { SxProps } from "@mui/system";

interface StandardSwitchProps extends SwitchProps {
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  labelSx?: SxProps;
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

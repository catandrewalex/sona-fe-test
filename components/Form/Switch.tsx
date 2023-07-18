import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MuiSwitch, { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import React from "react";
import { SxProps } from "@mui/system";

interface SwitchProps extends MuiSwitchProps {
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  labelSx?: SxProps;
}

const Switch = ({ label, labelPlacement, labelSx, ...props }: SwitchProps): JSX.Element => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MuiSwitch {...props} />}
        label={label || ""}
        labelPlacement={labelPlacement || "end"}
        sx={labelSx}
      />
    </FormGroup>
  );
};

export default Switch;

import { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import { SxProps } from "@mui/system";
import { ValidationConfig } from "@sonamusica-fe/utils/ValidationUtil";

import { FormControlLabel, FormGroup, Switch as MuiSwitch } from "@mui/material";

export interface SwitchProps<T> extends MuiSwitchProps {
  labelPlacement?: "end" | "start" | "top" | "bottom";
  labelSx?: SxProps;
  validations?: Array<ValidationConfig<T>>;
  field: keyof T;
  label: string;
  valueRef: React.MutableRefObject<T>;
  errorRef: React.MutableRefObject<Record<keyof T, string>>;
  testIdContext?: string;
}

const Switch = <T extends unknown>({
  labelPlacement,
  labelSx,
  field,
  label,
  valueRef,
  onChange,
  testIdContext,
  ...props
}: SwitchProps<T>): JSX.Element => {
  const [internalValue, setInternalValue] = useState<boolean>(false);

  useEffect(() => {
    setInternalValue((valueRef.current[field] as unknown as boolean) || false);
  }, [valueRef.current[field]]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <MuiSwitch
            checked={internalValue}
            data-testid={testIdContext + "-Switch"}
            {...props}
            onChange={(e, checked) => {
              setInternalValue(checked);
              if (onChange) onChange(e, checked);
              valueRef.current[field] = checked as unknown as T[keyof T];
            }}
          />
        }
        label={label}
        labelPlacement={labelPlacement || "end"}
        sx={labelSx}
      />
    </FormGroup>
  );
};

export default Switch;

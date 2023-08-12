/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Grid, { GridSize } from "@mui/material/Grid";
import { titleCase } from "@sonamusica-fe/utils/StringUtil";
import { CSSProperties } from "@mui/styles";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";

type SearchDropdownProps = {
  label: string;
  data: any[];
  onChange?: (value: string[]) => void;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  sx?: CSSProperties;
  limitTags?: number;
  value: any[];
  getOptionLabel: (option: any) => string;
  keyChild?: string;
  testIdContext?: string;
};

const SearchDropdown = ({
  label,
  data,
  xl = 3,
  lg = 4,
  md = 6,
  xs = 12,
  sm = 12,
  sx,
  value,
  onChange,
  getOptionLabel,
  limitTags,
  keyChild,
  testIdContext
}: SearchDropdownProps): JSX.Element => {
  const [innerValue, setValue] = useState<any[]>([]);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <Grid
      key={keyChild}
      item
      sm={sm}
      xl={xl}
      lg={lg}
      md={md}
      xs={xs}
      sx={{ pt: "0 !important", px: 1, py: 0.5 }}
      alignSelf="flex-start"
    >
      <StandardSelect<any, true>
        multiple
        limitTags={limitTags}
        inputProps={{
          label: titleCase(label) + " Filter",
          margin: "dense",
          sx: {
            [`& fieldset`]: {
              borderRadius: 8
            }
          }
        }}
        options={data}
        value={innerValue}
        sx={sx}
        testIdContext={testIdContext + "-SearchDropdownFilter"}
        getOptionLabel={getOptionLabel}
        onChange={(_e, value) => {
          setValue(value);
          onChange ? onChange(value) : undefined;
        }}
      />
    </Grid>
  );
};

export default SearchDropdown;

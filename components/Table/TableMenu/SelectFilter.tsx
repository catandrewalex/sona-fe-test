/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { GridSize } from "@mui/material/Grid";
import { titleCase } from "@sonamusica-fe/utils/StringUtil";
import { CSSProperties } from "@mui/styles";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";

import { Grid } from "@mui/material";

type SelectFilterProps = {
  column: string;
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

const SelectFilter = ({
  column,
  data,
  xl,
  lg,
  md,
  sm,
  xs,
  sx,
  value,
  onChange,
  getOptionLabel,
  limitTags,
  keyChild,
  testIdContext
}: SelectFilterProps): JSX.Element => {
  const [innerValue, setValue] = useState<any[]>([]);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <Grid
      key={keyChild}
      item
      xl={xl}
      lg={lg}
      md={md}
      sm={sm}
      xs={xs}
      sx={{ pt: "0 !important", px: 1, py: 0.5 }}
      alignSelf="flex-start"
    >
      <StandardSelect<any, true>
        multiple
        limitTags={limitTags}
        inputProps={{ label: titleCase(column) + " Filter", margin: "dense" }}
        options={data}
        value={innerValue}
        sx={sx}
        testIdContext={testIdContext + "-TableSelectFilter"}
        getOptionLabel={getOptionLabel}
        onChange={(_e, value) => {
          setValue(value);
          onChange ? onChange(value) : undefined;
        }}
      />
    </Grid>
  );
};

export default SelectFilter;

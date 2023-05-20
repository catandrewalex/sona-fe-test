/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Grid, { GridSize } from "@mui/material/Grid";
import Select from "@sonamusica-fe/components/Form/Select";
import { capitalizeWord } from "@sonamusica-fe/utils/StringUtil";
import { CSSProperties } from "@mui/styles";

type SelectFilterProps = {
  column: string;
  data: any[];
  onChange?: (value: string[]) => void;
  xs?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  sx?: CSSProperties;
  limitTags?: number;
  value: any[];
  getOptionLabel: (option: any) => string;
  keyChild?: string;
};

const SelectFilter = ({
  column,
  data,
  xl,
  lg,
  md,
  xs,
  sx,
  value,
  onChange,
  getOptionLabel,
  limitTags,
  keyChild
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
      xs={xs}
      sx={{ pt: "0 !important", px: 1, py: 0.5 }}
      alignSelf="flex-start"
    >
      <Select<any, true>
        multiple
        limitTags={limitTags}
        inputProps={{ label: capitalizeWord(column) + " Filter", margin: "dense" }}
        options={data}
        value={innerValue}
        sx={sx}
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

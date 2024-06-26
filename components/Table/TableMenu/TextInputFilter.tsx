import { SearchOutlined } from "@mui/icons-material";
import { GridSize } from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { CSSProperties } from "@mui/styles";
import { useGridApiContext } from "@mui/x-data-grid";
import StandardTextInput from "@sonamusica-fe/components/Form/StandardTextInput";

import { Grid } from "@mui/material";

type TextInputFilterProps = {
  column: string;
  columnLabel?: string;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  sx?: CSSProperties;
  value: string;
  onChange?: (value: string) => void;
  keyChild?: string;
  helperText?: string;
  testIdContext?: string;
};

const TextInputFilter = ({
  column,
  columnLabel,
  xl,
  lg,
  md,
  sm,
  xs,
  sx,
  onChange,
  value,
  keyChild,
  helperText,
  testIdContext
}: TextInputFilterProps): JSX.Element => {
  const [innerValue, setValue] = useState<string>("");

  useEffect(() => {
    setValue(value);
  }, [value]);

  const gridApi = useGridApiContext();

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
      <StandardTextInput
        label={
          columnLabel
            ? `Search for ${columnLabel}`
            : `Search for ${gridApi.current.getColumn(column).headerName}`
        }
        endAdornment={<SearchOutlined />}
        variant="outlined"
        margin="dense"
        type="text"
        value={innerValue}
        helperText={helperText}
        sx={sx}
        testIdContext={testIdContext + "-TableInputFilter"}
        onChange={(e) => {
          setValue(e.target.value);
          onChange ? onChange(e.target.value) : undefined;
        }}
      />
    </Grid>
  );
};

export default TextInputFilter;

import { SearchOutlined } from "@mui/icons-material";
import Grid, { GridSize } from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { CSSProperties } from "@mui/styles";
import StandardTextInput from "@sonamusica-fe/components/Form/StandardTextInput";

type SearchTextProps = {
  xs?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  sx?: CSSProperties;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  keyChild?: string;
  helperText?: string;
  testIdContext?: string;
};

const SearchText = ({
  label,
  xl = 3,
  lg = 4,
  md = 6,
  xs = 12,
  sx,
  onChange,
  value,
  keyChild,
  helperText,
  testIdContext
}: SearchTextProps): JSX.Element => {
  const [innerValue, setValue] = useState<string>("");

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
      <StandardTextInput
        label={label}
        endAdornment={<SearchOutlined />}
        variant="outlined"
        margin="dense"
        type="text"
        value={innerValue}
        helperText={helperText}
        sx={sx}
        InputProps={{ sx: { borderRadius: 100 } }}
        testIdContext={testIdContext + "-SearchTextFilter"}
        onChange={(e) => {
          setValue(e.target.value);
          onChange ? onChange(e.target.value) : undefined;
        }}
      />
    </Grid>
  );
};

export default SearchText;

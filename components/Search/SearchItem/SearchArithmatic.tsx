import { SearchOutlined } from "@mui/icons-material";
import Grid, { GridSize } from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import StandardTextInput from "@sonamusica-fe/components/Form/StandardTextInput";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";

type SearchArithmeticProps = {
  sm?: GridSize;
  xs?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  keyChild?: string;
  helperText?: string;
  testIdContext?: string;
};

const SearchArithmetic = ({
  label,
  xl = 3,
  lg = 4,
  md = 6,
  xs = 12,
  sm = 12,
  onChange,
  value,
  keyChild,
  helperText,
  testIdContext
}: SearchArithmeticProps): JSX.Element => {
  const [innerValue, setValue] = useState<string>("");
  const [equalitySign, setEqualitySign] = useState<string>("=");

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
      sm={sm}
      sx={{ pt: "0 !important", px: 1, py: 0.5, mt: -1, display: "flex", alignItems: "center" }}
      alignSelf="flex-start"
    >
      <StandardSelect
        options={["=", "<", "<=", ">", ">="]}
        fullWidth={false}
        getOptionLabel={(option) => option}
        value={equalitySign}
        sx={{ width: "75px", marginTop: 0 }}
        disableClearable={true}
        inputProps={{
          sx: {
            [`& fieldset`]: {
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            }
          }
        }}
        onChange={(_e, value) => {
          if (value) {
            setEqualitySign(value);
            onChange ? onChange(value + innerValue) : undefined;
          }
        }}
      />
      <StandardTextInput
        label={label}
        endAdornment={<SearchOutlined />}
        variant="outlined"
        margin="dense"
        type="number"
        value={innerValue}
        helperText={helperText}
        sx={{ marginLeft: "-1px", marginTop: 1.5 }}
        InputProps={{
          sx: {
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }
        }}
        testIdContext={testIdContext + "-SearchArithmeticFilter"}
        onChange={(e) => {
          setValue(e.target.value);
          onChange ? onChange(equalitySign + e.target.value) : undefined;
        }}
      />
    </Grid>
  );
};

export default SearchArithmetic;

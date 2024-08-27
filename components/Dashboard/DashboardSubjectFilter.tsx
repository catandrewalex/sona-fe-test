import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid2Props
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useCallback, useEffect, useState } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDebouncedCallback } from "@sonamusica-fe/utils/LodashUtil";

interface SubjectFilterProps<T> {
  gridProps?: Grid2Props;
  subjectLabel?: string;
  options: T[];
  getOptionLabel?: (option: T) => string;
  getSubjectId: (option: T) => string;
  onChange: (selectedSubject: T[]) => void;
}

const DashboardSubjectFilter = <T extends unknown>({
  options,
  getOptionLabel,
  subjectLabel,
  gridProps,
  onChange,
  getSubjectId
}: SubjectFilterProps<T>): JSX.Element => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const result: Record<string, boolean> = {};
    options.forEach((option) => (result[getSubjectId(option)] = true));
    setSelectedOptions(result);
  }, [options]);

  const onSelectAllClick = useCallback(() => {
    setSelectedOptions((prev) => {
      const result: Record<string, boolean> = {};
      Object.keys(prev).forEach((val) => (result[val] = true));
      onChangeDebounceCallback(onChange, result);
      return result;
    });
  }, [onChange]);

  const onUnselectAllClick = useCallback(() => {
    setSelectedOptions((prev) => {
      const result: Record<string, boolean> = {};
      Object.keys(prev).forEach((val) => (result[val] = false));
      onChangeDebounceCallback(onChange, result);
      return result;
    });
  }, [onChange]);

  const onChangeDebounceCallback = useDebouncedCallback(
    (fn: (selectedSubject: T[]) => void, selectedOptions: Record<string, boolean>) => {
      const result: T[] = options.filter((option) => selectedOptions[getSubjectId(option)]);
      onChange(result);
    },
    800
  );

  return (
    <Grid2 {...gridProps}>
      <Box component={"fieldset"}>
        <legend>{subjectLabel || "Subject Filter"}</legend>
        <Button
          onClick={onSelectAllClick}
          size={"small"}
          startIcon={<CheckBoxIcon />}
          sx={{ mr: 1, mb: 1 }}
          variant={"outlined"}
        >
          Check All
        </Button>
        <Button
          onClick={onUnselectAllClick}
          size={"small"}
          startIcon={<CheckBoxOutlineBlankIcon />}
          variant={"outlined"}
          sx={{ ml: 1, mb: 1 }}
        >
          Uncheck All
        </Button>
        <Divider />
        <FormGroup row>
          {options.map((option) => {
            const label = getOptionLabel ? getOptionLabel(option) : "Unnamed";
            return (
              <FormControlLabel
                onChange={(_e, checked) => {
                  const id = getSubjectId(option);
                  const newSelectedOption = { ...selectedOptions, [id]: checked };
                  setSelectedOptions(newSelectedOption);
                  onChangeDebounceCallback(onChange, newSelectedOption);
                }}
                key={label}
                control={
                  <Checkbox
                    checked={
                      selectedOptions[getSubjectId(option)] === undefined
                        ? true
                        : selectedOptions[getSubjectId(option)]
                    }
                  />
                }
                label={label}
              />
            );
          })}
        </FormGroup>
      </Box>
    </Grid2>
  );
};

export default DashboardSubjectFilter;

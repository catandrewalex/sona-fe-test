import { Remove } from "@mui/icons-material";
import { Typography, IconButton, Grid, Button } from "@mui/material";
import { Box } from "@mui/system";
import { FormFieldCustomProps } from "@sonamusica-fe/components/Form/FormRenderer";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";
import { Student } from "@sonamusica-fe/types";
import { useNotEmptyArray } from "@sonamusica-fe/utils/ValidationUtil";
import React, { useCallback, useEffect, useState } from "react";

type StudentSelectorInputProps<T> = {
  options: Student[];
  onChange: (e: Student[]) => void;
  testIdContext?: string;
} & FormFieldCustomProps<T>;

const StudentSelectorInput = <T extends unknown>({
  valueRef,
  errorRef,
  field,
  label,
  validations,
  options,
  onChange,
  testIdContext
}: StudentSelectorInputProps<T>): JSX.Element => {
  const [selectValue, setSelectValue] = useState<Student | null>(null);
  const [internalValue, setInternalValue] = useState<Array<Student>>([]);
  const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");

  const notEmptyArrayCheck = useNotEmptyArray(label);
  const validationHandler = useCallback(
    (value: Array<Student>) => {
      if (validations) {
        for (const validation of validations) {
          let errorMsg = "";
          switch (validation.name) {
            case "not-empty-array":
              errorMsg = notEmptyArrayCheck(value);
              break;
          }
          if (errorMsg) {
            setInternalErrorMsg(errorMsg);
            return errorMsg;
          }
        }
      }
      setInternalErrorMsg("");
      return "";
    },
    [validations]
  );

  useEffect(() => {
    setInternalValue((valueRef.current[field] as unknown as Student[]) || []);
  }, [valueRef.current[field]]);

  useEffect(() => {
    if (errorRef.current[field] !== undefined && errorRef.current[field] !== internalErrorMsg) {
      setInternalErrorMsg(errorRef.current[field]);
    }
  }, [errorRef.current[field]]);

  return (
    <>
      {internalValue.length > 0 && (
        <>
          <Typography variant="body2">Student(s):</Typography>
          <ul style={{ paddingLeft: "24px", margin: 0 }}>
            {internalValue.map(({ studentId, user }, index) => {
              return (
                <li key={studentId}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <Typography sx={{ height: "fit-content", alignSelf: "center" }}>
                      {user.userDetail.firstName} {user.userDetail.lastName || ""}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        const newValue = [...internalValue];
                        newValue.splice(index, 1);
                        setInternalValue(newValue);
                        errorRef.current[field] = validationHandler(newValue);
                        if (onChange) onChange(newValue);
                        valueRef.current[field] = newValue as unknown as T[keyof T];
                      }}
                      color="error"
                    >
                      <Remove />
                    </IconButton>
                  </Box>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <Grid container>
        <Grid item xs={12}>
          <StandardSelect
            testIdContext={testIdContext}
            blurOnSelect
            errorMsg={internalErrorMsg}
            options={options.filter(
              (option) => !internalValue.map((val) => val.studentId).includes(option.studentId)
            )}
            value={selectValue}
            getOptionLabel={(option) =>
              `${option.user.userDetail.firstName} ${option.user.userDetail.lastName || ""}`
            }
            inputProps={{ label: "Choose Student", placeholder: "(No Student)" }}
            onChange={(_e, value) => {
              if (value) {
                const newValue = [...internalValue];
                newValue.push(value);
                setInternalValue(newValue);
                setSelectValue(null);
                errorRef.current[field] = validationHandler(newValue);
                if (onChange) onChange(newValue);
                valueRef.current[field] = newValue as unknown as T[keyof T];
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StudentSelectorInput;

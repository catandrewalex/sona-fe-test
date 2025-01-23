import { FormControl, Typography } from "@mui/material";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { Box } from "@mui/system";
import { SmallCancelAndSubmitButtons } from "@sonamusica-fe/components/Form/SmallCancelAndSubmitButtons";
import StandardSelect from "@sonamusica-fe/components/Form/StandardSelect";
import FormDataViewerTable from "@sonamusica-fe/components/Table/FormDataViewerTable";
import {
  Attendance,
  StudentLearningToken,
  StudentLearningTokenDisplay
} from "@sonamusica-fe/types";
import {
  convertNumberToCurrencyString,
  getMinimalStudentLearningTokenName
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment";
import { useCallback, useState } from "react";
import { AssignAttendanceTokenFormRequest } from "@sonamusica-fe/types/form/attendance";
import { FailedResponse } from "api";

interface AttendanceDetailTokenViewProps {
  selectedAttendance: Attendance;
  studentLearningTokenOptions?: StudentLearningTokenDisplay[];
  isUserHasWriteAccess: boolean;
  refetchAllData: () => void;
  onCancel: () => void;
}

const AttendanceDetailTokenView = ({
  selectedAttendance,
  studentLearningTokenOptions,
  isUserHasWriteAccess,
  refetchAllData,
  onCancel
}: AttendanceDetailTokenViewProps): JSX.Element => {
  return (
    <Box>
      {selectedAttendance.studentLearningToken.studentLearningTokenId !== 0 && (
        <TokenDetail studentLearningToken={selectedAttendance.studentLearningToken} />
      )}
      {isUserHasWriteAccess && !selectedAttendance.isPaid && (
        <TokenSelectForm
          selectedAttendance={selectedAttendance}
          studentLearningTokenOptions={studentLearningTokenOptions}
          refetchAllData={refetchAllData}
          onCancel={onCancel}
        />
      )}
    </Box>
  );
};

interface TokenDetailProps {
  studentLearningToken: StudentLearningToken;
}

const TokenDetail = ({ studentLearningToken }: TokenDetailProps): JSX.Element => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>
      Token #{studentLearningToken.studentLearningTokenId} Detail
    </Typography>
    <FormDataViewerTable
      tableProps={{ size: "small", sx: { mt: 1 } }}
      tableRowProps={{
        sx: {
          "& .MuiTableCell-root:first-child": {
            width: "160px",
            pl: 0
          }
        }
      }}
      data={[
        {
          title: "Remaining Quota",
          value: studentLearningToken.quota.toString()
        },
        {
          title: "Active",
          value: moment(studentLearningToken.createdAt).format("DD MMMM YYYY HH:mm")
        },
        {
          title: "Last Updated",
          value: moment(studentLearningToken.lastUpdatedAt).format("DD MMMM YYYY HH:mm")
        },
        {
          title: "Course Fee",
          value: convertNumberToCurrencyString(studentLearningToken.courseFeeValue)
        },
        {
          title: "Transport Fee",
          value: convertNumberToCurrencyString(studentLearningToken.transportFeeValue)
        }
      ]}
      CellValueComponent={Typography}
      cellValueComponentProps={{ variant: "h5", fontSize: 16 }}
    />
  </Box>
);

interface TokenSelectFormProps {
  selectedAttendance: Attendance;
  studentLearningTokenOptions?: StudentLearningTokenDisplay[];
  refetchAllData: () => void;
  onCancel: () => void;
}

const TokenSelectForm = ({
  selectedAttendance,
  studentLearningTokenOptions,
  refetchAllData,
  onCancel
}: TokenSelectFormProps): JSX.Element => {
  const [selectedToken, setSelectedToken] = useState<StudentLearningTokenDisplay | null>(
    selectedAttendance?.studentLearningToken.studentLearningTokenId !== 0
      ? selectedAttendance?.studentLearningToken
      : null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const apiTransformer = useApiTransformer();

  const handleCancel = useCallback(() => {
    setSelectedToken(null);
    onCancel();
  }, [setSelectedToken, onCancel]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const response = await API.AssignAttendanceToken(selectedAttendance?.attendanceId || 0, {
      studentLearningTokenId: selectedToken?.studentLearningTokenId
    } as AssignAttendanceTokenFormRequest);
    const parsedResponse = apiTransformer(response, true);
    if (Object.getPrototypeOf(parsedResponse) === FailedResponse.prototype) {
      return parsedResponse as FailedResponse;
    } else {
      refetchAllData();
    }
    setLoading(false);
  }, [selectedAttendance, selectedToken, refetchAllData]);

  return (
    <FormControl fullWidth>
      <StandardSelect
        sx={{ width: "40vw" }}
        value={selectedToken}
        disabled={loading}
        blurOnSelect
        options={studentLearningTokenOptions ?? []}
        isOptionEqualToValue={(option, value) =>
          option.studentLearningTokenId == value.studentLearningTokenId
        }
        getOptionLabel={(option) => getMinimalStudentLearningTokenName(option)}
        inputProps={{ label: "Select new token...", placeholder: "(No Token)" }}
        onChange={(_e, value) => {
          setSelectedToken(value);
        }}
      />

      <SmallCancelAndSubmitButtons
        loading={loading}
        cancelButtonText="Cancel"
        cancelButtonDisabled={loading}
        cancelButtonOnClick={handleCancel}
        submitButtonText="Update"
        submitButtonDisabled={!selectedToken}
        submitButtonOnClick={handleSubmit}
      ></SmallCancelAndSubmitButtons>
    </FormControl>
  );
};

export default AttendanceDetailTokenView;

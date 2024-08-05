import { Button, Typography } from "@mui/material";
import { Student } from "@sonamusica-fe/types";
import React from "react";

type StudentColumRendererProps = {
  students: Student[];
  detailClickHandler: () => void;
};

const StudentColumnRenderer = ({
  students,
  detailClickHandler
}: StudentColumRendererProps): JSX.Element => {
  if (students.length === 0) {
    return (
      <Typography component="span" variant="body2">
        -
      </Typography>
    );
  } else if (students.length > 2) {
    return (
      <Button variant="outlined" onClick={detailClickHandler}>
        Show {students.length} students
      </Button>
    );
  } else {
    return (
      <>
        <Typography variant="body2" component="span">
          {students
            .map(
              (student) =>
                student.user.userDetail.firstName + " " + (student.user.userDetail.lastName || "")
            )
            .join(", ")}
        </Typography>
      </>
    );
  }
};

export default StudentColumnRenderer;

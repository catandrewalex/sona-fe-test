import { UrlObject } from "url";
import { GridCellParams } from "@mui/x-data-grid";
import React from "react";
import Link from "next/link";

import { CSSObject, Box } from "@mui/material";

type ColouredCellProps = {
  params: GridCellParams;
  containerStyle?: CSSObject;
  contentStyle?: CSSObject;
  applyStyle: (value: unknown) => boolean;
  value?: string;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  link?: string | UrlObject;
};

const ColouredCell = ({
  params,
  containerStyle,
  contentStyle,
  applyStyle,
  endAdornment,
  value,
  startAdornment,
  link
}: ColouredCellProps): JSX.Element => {
  if (applyStyle(params.value)) {
    if (link) {
      return (
        <Box sx={containerStyle}>
          <Link href={link} passHref>
            <Box component="span" sx={contentStyle}>
              {startAdornment} {value || params.value} {endAdornment}
            </Box>
          </Link>
        </Box>
      );
    }
    return (
      <Box sx={containerStyle}>
        <Box component="span" sx={contentStyle}>
          {startAdornment} {value || params.value} {endAdornment}
        </Box>
      </Box>
    );
  }
  if (link) {
    return (
      <Box sx={containerStyle}>
        <Link href={link} passHref>
          <Box component="span">
            {startAdornment} {value || params.value} {endAdornment}
          </Box>
        </Link>
      </Box>
    );
  }
  return (
    <Box sx={containerStyle}>
      <Box component="span">
        {startAdornment} {value || params.value} {endAdornment}
      </Box>
    </Box>
  );
};

export default ColouredCell;

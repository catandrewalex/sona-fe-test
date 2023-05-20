import { Tooltip as MuiTooltip } from "@mui/material";
import React from "react";

type TooltipProps = {
  content: string | JSX.Element | JSX.Element[];
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  children: JSX.Element;
};

const Tooltip = ({ content, placement = "bottom", children }: TooltipProps): JSX.Element => {
  return (
    <MuiTooltip title={content} arrow placement={placement}>
      <span>{children}</span>
    </MuiTooltip>
  );
};

export default Tooltip;

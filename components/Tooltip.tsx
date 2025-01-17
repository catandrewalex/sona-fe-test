import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material";
import React from "react";

type TooltipProps = {
  title: string | JSX.Element | JSX.Element[];
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
} & MuiTooltipProps;

const Tooltip = ({
  title,
  placement = "bottom",
  children,
  ...props
}: TooltipProps): JSX.Element => {
  return (
    <MuiTooltip {...props} title={title} arrow placement={placement}>
      <span>{children}</span>
    </MuiTooltip>
  );
};

export default Tooltip;

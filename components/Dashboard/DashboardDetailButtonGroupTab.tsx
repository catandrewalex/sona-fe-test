import { FormattedMonthName } from "@sonamusica-fe/utils/StringUtil";
import { Box, Button, ButtonGroup } from "@mui/material";
import { RefObject } from "react";

interface ExpenseDetailButtonGroupTabProps {
  monthNames: FormattedMonthName[];
  onButtonClick: (item: FormattedMonthName) => void;
  containerRef:
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>
    | null
    | undefined;
  selected?: FormattedMonthName;
}

const DashboardDetailButtonGroupTab = ({
  monthNames,
  onButtonClick,
  containerRef,
  selected
}: ExpenseDetailButtonGroupTabProps): JSX.Element => {
  return (
    <Box sx={{ ml: 1, overflowX: "auto", width: "1px", px: 2 }} flex={1}>
      <ButtonGroup ref={containerRef}>
        {monthNames.map((monthName) => (
          <Button
            sx={{ scrollMarginInlineEnd: "50px" }}
            onClick={() => onButtonClick(monthName)}
            id={`id-${monthName.month}-${monthName.year}`}
            variant={
              monthName.month === selected?.month && monthName.year === selected?.year
                ? "contained"
                : "outlined"
            }
            key={`${monthName.month}-${monthName.year}`}
          >
            {monthName.text}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default DashboardDetailButtonGroupTab;

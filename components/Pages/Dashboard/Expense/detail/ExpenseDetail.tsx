import { Box, Typography } from "@mui/material";
import { ExpenseDashboardOverviewRequestBody } from "@sonamusica-fe/types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FormattedMonthName,
  getMonthNamesFromTwoMomentInstance
} from "@sonamusica-fe/utils/StringUtil";
import moment from "moment/moment";
import DashboardDetailMenuButton from "@sonamusica-fe/components/Dashboard/DashboardDetailMenuButton";
import DashboardDetailButtonGroupTab from "@sonamusica-fe/components/Dashboard/DashboardDetailButtonGroupTab";
import ExpenseDetailPieChart from "@sonamusica-fe/components/Pages/Dashboard/Expense/detail/ExpenseDetailPieChart";

interface ExpenseDetailProps {
  data: ExpenseDashboardOverviewRequestBody | undefined;
  ready: boolean;
}

const ExpenseDetail = ({ data, ready }: ExpenseDetailProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<FormattedMonthName>();
  const [monthNames, setMonthNames] = useState<FormattedMonthName[]>([]);
  const buttonGroupRef = useRef<HTMLDivElement | null>(null);

  const forceScroll = useCallback((text: string) => {
    if (buttonGroupRef && buttonGroupRef.current) {
      const filteredChildren = (buttonGroupRef.current as HTMLDivElement).querySelectorAll(
        "#id-" + text
      );
      filteredChildren[0]?.scrollIntoView({ inline: "end", block: "center" });
    }
  }, []);

  const onMenuClicked = useCallback(
    (item: FormattedMonthName) => {
      setSelectedDate(item);
      forceScroll(`${item.month}-${item.year}`);
    },
    [forceScroll]
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (data) {
      const temp = getMonthNamesFromTwoMomentInstance(
        moment(`${data.dateRange.startDate.year}-${data.dateRange.startDate.month}`, "yyyy-MM"),
        moment(`${data.dateRange.endDate.year}-${data.dateRange.endDate.month}`, "yyyy-MM"),
        { asObject: true }
      );
      setMonthNames(temp);
      setSelectedDate(temp[temp.length - 1]);

      timeout = setTimeout(
        () => forceScroll(`${temp[temp.length - 1].month}-${temp[temp.length - 1].year}`),
        1000
      );
    } else {
      setMonthNames([]);
      setSelectedDate(undefined);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [data, forceScroll]);

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 1 }}>
        Details
      </Typography>
      <Box display={"flex"}>
        <DashboardDetailMenuButton monthNames={monthNames} onMenuClick={onMenuClicked} />
        <DashboardDetailButtonGroupTab
          monthNames={monthNames}
          onButtonClick={onMenuClicked}
          containerRef={buttonGroupRef}
          selected={selectedDate}
        />
      </Box>
      <ExpenseDetailPieChart data={data} selected={selectedDate} ready={ready} />
    </Box>
  );
};

export default ExpenseDetail;
